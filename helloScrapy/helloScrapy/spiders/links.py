import scrapy

# Scraper (1 of 2) that pulls the links for the question/answer/corresponding category

class LinkSpider(scrapy.Spider):
    name = 'links'
    start_urls = [f'https://jeopardyquestions.com/?page={i}' for i in range(1, 39248)]

    def parse(self, response):
        links = response.xpath('//*[@class="card"]/a').css('a::attr(href)').getall()[1::2]

        for link in links:
            yield {
                'link': link
            }



## Results
 # 'elapsed_time_seconds': 8470.924006,
 # 'httperror/response_ignored_count': 34242,
 # 'httperror/response_ignored_status_count/500': 34242,
 # 'item_scraped_count': 50004,
 # 'log_count/DEBUG': 157748,
 # 'log_count/ERROR': 34250,
 # 'log_count/INFO': 34349,


