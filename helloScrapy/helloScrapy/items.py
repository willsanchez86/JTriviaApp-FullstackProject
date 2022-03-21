# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html
# Extracted data -> Temporary containers (items) -> storing in database

import scrapy


class HelloscrapyItem(scrapy.Item):
    # define the fields for your item here like:
    question = scrapy.Field()
    answer = scrapy.Field()
    category = scrapy.Field()

