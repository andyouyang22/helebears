from datetime import date
import re
from selenium import webdriver
import requests
from bs4 import BeautifulSoup
from tidylib import tidy_document
from . import engine, Session
from .models import Department, Course, Section, SectionInstance 

SEMESTERS = { 'Fall': 'FL', 'Spring': 'SP', 'Summer': 'SU' }

def scrape_sections(semester, year, session):
    for dept in session.query(Department).order_by(Department.abbreviation):
        search_dept(dept, semester, year, session)

def search_dept(dept, semester, year, session):
    payload = { 'p_term': SEMESTERS[semester],
                'p_deptname': '-- Choose a Department Name --',
                'p_classif': '-- Choose a Course Classification --',
                'p_presuf': '-- Choose a Course Prefix/Suffix --',
                'p_dept': dept.abbreviation }
    r = requests.post('http://osoc.berkeley.edu/OSOC/osoc', params=payload)
    txt, err = tidy_document(r.text)
    analyze_html(txt, dept, semester, year, session)

    # get the total rows so we can keep searching
    soup = BeautifulSoup(txt)
    tables = soup.find_all('table')
    is_total_rows = lambda tag: tag.has_attr('name') and tag['name'] == 'p_total_rows'
    inp = tables[0].find_all(is_total_rows)
    if inp:
        totalrows = int(inp[0]['value'])
        # each page displays 100 rows (sections); index starts with 1, not 0
        for i in range(1, ((totalrows/100)+1)):
            payload['p_start_row'] = str(100*i + 1)
            r = requests.post('http://osoc.berkeley.edu/OSOC/osoc',
                              params=payload)
            txt, err = tidy_document(r.text)
            analyze_html(txt, dept, semester, year, session)

def analyze_html(txt, dept, semester, year, session):
    soup = BeautifulSoup(txt)

    # each section is displayed as a table
    tables = soup.find_all('table')
    sections = tables[1:(len(tables)-1)]

    for section in sections:
        analyze_section(section, dept, semester, year, session)

def analyze_section(section, dept, semester, year, session):
    dpt_map = scrape_acronyms()
    rows = section.find_all('tr')
    inputs = section.find_all('input')

    # split 'STATISTICS 2 P 001 LEC' into ['STATISTICS', '2', 'P', '001', 'LEC']
    section_info = rows[0].find_all('td')[2].b.string.strip()
    section_info_parts = section_info.split()
    course_number = section_info_parts[-4].strip()
    section_number = section_info_parts[-2].strip()
    section_format = section_info_parts[-1].strip()
    if section_format == 'LEC':
        x = str(rows[2].find_all('td')[1].tt.string.strip().split(',')[0])
        try:
            untz = rows[6].find_all('td')[1].tt.contents[0]
            if x != 'CANCELLED' and x != 'TBA' and '-' not in untz and 'SU' not in untz and 'PF' not in untz:
                am_pm = x[len(x)-1]
                class_days = str(x[0:len(x)-1].split()[0])
                start_end = x[0:len(x)-1].split()[1].split('-')
                if am_pm == 'P':
                    if not '12' in start_end[1]:
                        if len(start_end[1]) == 1:
                            start_end[1] = str(int(start_end[1][0])+12)+ start_end[1][1:] + "00"
                        elif len(start_end[1]) == 3:
                            start_end[1] = str(int(start_end[1][0])+12)+ start_end[1][1:]
                        elif len(start_end[1]) == 2:
                            start_end[1] = str(int(start_end[1][0:2])+12)+ start_end[1][2:] + "00"
                        else:
                            start_end[1] = str(int(start_end[1][0:2])+12)+ start_end[1][2:]
                    if len(start_end[0]) != 4:
                        if len(start_end[0]) == 2:
                            start_end[0] = str(int(start_end[0][0]))+ start_end[0][0:] + "00"
                        elif len(start_end[0]) == 1:
                            start_end[0] = str(int(start_end[0][0])+12)+ start_end[0][1:] + "00"
                        else:
                            start_end[0] = str(int(start_end[0][0])+12)+ start_end[0][1:]
                else:
                     if len(start_end[1]) == 1:
                        start_end[1] = "0" + str(int(start_end[1][0]))+ start_end[1][1:] + "00"
                     elif len(start_end[1]) == 3:
                        start_end[1] = "0" + str(int(start_end[1][0]))+ start_end[1][1:]
                     elif len(start_end[1]) == 2:
                        start_end[1] = str(int(start_end[1][0]))+ start_end[1][1:] + "00"
                     if len(start_end[0]) == 1:
                        start_end[0] = "0" + str(int(start_end[0][0]))+ start_end[0][1:] + "00"
                     elif len(start_end[0]) == 3:
                        start_end[0] = "0" + str(int(start_end[0][0]))+ start_end[0][1:]
                     elif len(start_end[0]) == 2:
                        start_end[0] = str(int(start_end[0][0]))+ start_end[0][1:] + "00"
                x = int(section_number)
                _url = "http://guide.berkeley.edu/search/?p=" + dpt_map[str(dept.name)] + "+" + str(course_number)
                browser = webdriver.Firefox()
                browser.get(_url)

                soup = BeautifulSoup(browser.page_source)
                browser.close()
                description = ""
                for ulist in soup.find_all(attrs={'class':"descshow"}):
                    description += re.sub('<[^<]+?>', '', str(ulist).split("<br />")[1])
                for ulist in soup.find_all(attrs={'class':"descshow overflow"}):
                    description += re.sub('<[^<]+?>', '', str(ulist).split("<br />")[1])
                for ulist in soup.find_all(attrs={'class':"deschide"}):
                    description += re.sub('<[^<]+?>', '', str(ulist))
                print description
                courses_dict = {"name":str(course_number), "number": int(section_number), "name_and_number": str(course_number) + " " + str(int(section_number)),
                                "professor_name": str(rows[3].find_all('td')[1].tt.string.strip()), "department_name": str(dept.name), "type": str(section_format),
                                'title': str(rows[1].find_all('td')[1].tt.b.font.b.contents[0].strip()), 'ccn':int(rows[5].find_all('td')[1].tt.contents[0]),
                                'units': float(rows[6].find_all('td')[1].tt.contents[0]),
                                'location': str(rows[2].find_all('td')[1].tt.string.strip().split(',')[1][1:]),
                                'time': class_days + " " + start_end[0] + " " + start_end[1],
                                "final_slot": 0, "limit": 10, "enrolled": 5, "waitlist": 5, "note": "", "course_description": description}
                r1 = requests.post("http://localhost:3000/api/courses/addProfessor", data={"professor_name":  str(rows[3].find_all('td')[1].tt.string.strip())})
                r2 = requests.post("http://localhost:3000/api/departments/addDepartment", data={"department_name":  str(dept.name)})
                r3 = requests.post("http://localhost:3000/api/courses/addCourses", data=courses_dict)
                print courses_dict
                print "===================================================================================="
        except Exception as exception:
            print exception
    # POSTING PROFESSORS
    # usually in the format 'TuTh 5-6:30P, 155 DWINELLE'
    timeplace = rows[2].find_all('td')[1].tt.string.strip().split(', ')
    if len(timeplace) > 1:
        # normal course
        days = timeplace[0].split()[0]
        time = timeplace[0].split()[1]
        location = timeplace[1]
    else:
        # special case
        days = time = location = ''

    instructor = blank_if_none(rows[3].find_all('td')[1].tt)
    status = blank_if_none(rows[4].find_all('td')[1].tt)
    ccn = blank_if_none(rows[5].find_all('td')[1].tt)
    units = blank_if_none(rows[6].find_all('td')[1].tt)

    if semester != 'Summer':
        final_exam_group = blank_if_none(rows[7].find_all('td')[1].tt)
        restrictions = blank_if_none(rows[8].find_all('td')[1].tt)
        session_dates = summer_fees = ''
    else:
        final_exam_group = restrictions = ''
        session_dates = blank_if_none(rows[7].find_all('td')[1].tt)
        summer_fees = blank_if_none(rows[8].find_all('td')[1].tt)

    note = blank_if_none(rows[9].find_all('td')[1].tt)

    enrollnums = rows[10].find_all('td')[1].tt.string.strip().split()[:3]
    try:
        limit = int(enrollnums[0][6:])
        enrolled = int(enrollnums[1][9:])
        waitlist = int(enrollnums[2][9:])
    except:
        limit = enrolled = waitlist = 0

    c = get_course(dept, course_number, semester, year, session)
    if c is None:
        c = Course(department_id=dept.id, department=dept, number=course_number,
                   semester=semester, year=year)
        session.add(c)

    s = get_section(c, section_format, section_number, session)
    if s is None:
        s = Section(course_id=c.id, course=c, section_format=section_format,
                    section_number=section_number)
        session.add(s)
    if check_instance(s, session) is None:
        i = SectionInstance(s.id, s, location, days, time, instructor, status, ccn, units,
                            session_dates, summer_fees, final_exam_group, restrictions,
                            note, enrolled, limit, waitlist)
        session.add(i)

def get_course(dept, number, semester, year, session):
    return first_or_none(session.query(Course).\
                                 filter_by(department=dept, number=number,
                                           semester=semester, year=year))

def get_section(course, section_format, section_number, session):
    return first_or_none(session.query(Section).\
                                 filter_by(course=course,
                                           section_number=section_number,
                                           section_format=section_format))

def check_instance(section, session):
    return first_or_none(session.query(SectionInstance).\
                                 filter_by(section=section,
                                           update_date=date.today()))

def first_or_none(query):
    if query.count() > 0:
        return query.first()
    else:
        return None

def blank_if_none(tt):
    if tt:
        return tt.text.strip()
    else:
        return ''

def run(semester, year):
    session = Session()
    try:
        scrape_sections(semester, year, session)
        session.commit()
    except:
        session.rollback()
        raise
    finally:
        session.close() 


def scrape_acronyms():
    mappings = {}
    sburl = 'http://guide.berkeley.edu/courses/'
    r = requests.get(sburl)
    soup = BeautifulSoup(r.text)
    trigger = False
    for ulist in soup.find_all('li'):
        if not trigger:
            if 'Aerospace Studies' in str(ulist):
                trigger = True
        if trigger:
            output = re.sub('<[^<]+?>', '', str(ulist)).split('(')
            output[1] = output[1][:len(output[1])-1]
            output[1] = output[1].replace(" ", "")
            mappings[output[0][:len(output[0])-1]] = output[1]
    return mappings
