import scrapy
from ..items import HelloscrapyItem
import csv

# Create a list of urls from the csv file of links scraped
with open('links1.csv', newline="") as file:
    reader = csv.reader(file)
    urls = [row[0] for row in reader]


# Scraper (2 of 2) that pulls the questions, answers, and corresponding categories

class QuestionSpider(scrapy.Spider):
    name = 'questions'
    start_urls = urls[1:]

    def parse(self, response):

        items = HelloscrapyItem()

        categories = response.xpath('//*[@class="title"]/a/text()').getall()
        questions = response.xpath('//*[@class="card"]/p/text()').getall()
        answers = response.xpath('//*[@class="answer"]/text()').extract()

        for i in range(len(questions)):
            items['question'] = questions[i]
            items['answer'] = answers[i].replace("\n", "").replace("\t", "")
            items['category'] = categories[i]

            yield items
