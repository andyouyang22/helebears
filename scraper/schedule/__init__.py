from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

engine = create_engine('sqlite:///schedule.db', convert_unicode=True)
Session = sessionmaker(bind=engine)
