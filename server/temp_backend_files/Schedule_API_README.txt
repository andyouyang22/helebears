Usage for schedules API
NOTE: CONFLICT HANDLING NOT IMPLEMENTED

GET /api/schedules
    Returns {status: -1, errors: []} if query fails
    Returns {status: 1, results: []} Where results contain a list with {unique_id: "your_email",
                                                                        name_and_number: "name and number of the course"
                                                                         course_time: "MW 0930 1200"
                                                                         section_time: "TH 1200 0130"
                                                                         lab_time: "F 0900 1200"}


POST /api/schedules/add
    Returns {status: -1, errors: []} if adding class to schedule fails
    Post data = {name_and_number: "name and number of the course"
                 course_time: "MW 0930 1200"
                 section_time: "TH 1200 0130"
                 lab_time: "F 0900 1200"}

POST /api/schedules/remove    < ---- Only really need to send "name_and_number"
    Returns {status: -1, errors: []} if removing class fails
        Post data = {name_and_number: "name and number of the course"
                     course_time: "MW 0930 1200"
                     section_time: "TH 1200 0130"
                     lab_time: "F 0900 1200"}
