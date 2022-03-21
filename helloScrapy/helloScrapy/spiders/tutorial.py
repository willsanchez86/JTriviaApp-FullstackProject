import scrapy

###-------------------------SCRAPY STARTUP STEPS---------------------------------###
## CHECK URL + '/robots.txt' to see if site has any scraping restrictions.
## --> If not, this can be disabled by going to settings.py within project, and setting ROBOTSTXT_OBEY = False


## 1) CREATE NEW SCRAPY PROJECT
# Ex: (venv) C:\Python\Udemy 100 Days of Code\JeopardyApp>scrapy startproject helloScrapy

## 2) CREATE NEW SCRAPY PYTHON FILE
# cd helloScrapy
# scrapy genspider example example.com
# Ex: (venv) C:\Python\Udemy 100 Days of Code\JeopardyApp\helloScrapy>scrapy genspider quotes quotes.toscrape.com

## 3) OPEN SHELL
# scrapy shell

## 4) FETCH
# fetch("url")

###-------------------------SELECTORS---------------------------------###
# response.xpath('//*[@class=""]')
# response.xpath('//*[@id=""]')


###-------------------------RUN SCRAPY---------------------------------###
#scrapy crawl [crawler_name]
# Ex: scrapy crawl quotes

class QuotesSpider(scrapy.Spider):
    name = 'quotes'
    # allowed_domains = ['quotes.toscrape.com']
    start_urls = ['https://jeopardyquestions.com/categories?page=1']

    def parse(self, response):
        top_tags = response.xpath('//*[@class="tag-item"]/a/text()').extract()
        print(top_tags)
        yield {'tags': top_tags}



