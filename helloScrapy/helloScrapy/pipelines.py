# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from itemadapter import ItemAdapter
import sqlite3

class HelloscrapyPipeline:

    def __init__(self):
        self.create_connection()
        self.create_table()

    def create_connection(self):
        # Initialize connection and cursor objects
        self.conn = sqlite3.connect('jeopardy.db')
        self.curr = self.conn.cursor()

    def create_table(self):
        self.curr.execute("""DROP TABLE IF EXISTS questions""")
        self.curr.execute("""CREATE TABLE questions(
                        question_id INTEGER PRIMARY KEY AUTOINCREMENT,
                        question varchar(255) NOT NULL,
                        answer varchar(255) NOT NULL,
                        category varchar(255) NOT NULL
                        )""")

    def process_item(self, item, spider):
        self.store_db(item)
        return item

    def store_db(self, item):
        self.curr.execute("""INSERT INTO questions(question, answer, category)  VALUES (?,?,?)""",(
            item['question'],
            item['answer'],
            item['category']
        ))
        self.conn.commit()