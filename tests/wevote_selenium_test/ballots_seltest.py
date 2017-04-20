# -*- coding: utf-8 -*-
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException
import unittest, time, re

class BallotsSeltest(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.implicitly_wait(30)
        self.base_url = "https://wevote.us/"
        self.verificationErrors = []
        self.accept_next_alert = True
    
    def test_ballots_sel(self):
        driver = self.driver
        driver.get("https://wevote.us")
        driver.find_element_by_css_selector("span.header-nav__label").click()
        driver.find_element_by_xpath("//div[@id='app-base-id']/div[2]/div/div/div[2]/div/div/div/div/div/a[2]/span").click()
        driver.find_element_by_link_text("Bookmarked").click()
        driver.find_element_by_css_selector("a.btn.btn-default > span").click()
        driver.find_element_by_link_text("Measure RR").click()
        driver.find_element_by_xpath("//div[@id='app-base-id']/div[2]/div/div/div[2]/div/section/div/div[2]/div/div/button").click()
        driver.find_element_by_css_selector("span.header-nav__label").click()
        driver.find_element_by_xpath("//div[@id='app-base-id']/div[2]/div/div/div[2]/div/div/div/div/div/a[2]/span").click()
        driver.find_element_by_xpath("//div[@id='app-base-id']/div[2]/div/div/div[2]/div/div/div/div/div/a[3]/span").click()
        driver.find_element_by_xpath("//div[@id='app-base-id']/div[2]/div/div/div/div/div/ul[3]/li[2]/a/div").click()
        driver.find_element_by_xpath("//div[@id='app-base-id']/div[2]/div/div/div/div/div/ul[3]/li/a/div").click()
        driver.find_element_by_xpath("//div[@id='app-base-id']/div[2]/div/div/div/div/div/ul[2]/li[3]/a/div").click()
        driver.find_element_by_xpath("//div[@id='app-base-id']/div[2]/div/div/div/div/div/ul[2]/li[2]/a/div/span").click()
        driver.find_element_by_css_selector("li.list-group-item > a > div").click()
        driver.find_element_by_xpath("//div[@id='app-base-id']/div[2]/div/div/div/div/div/ul[2]/li[2]/a/div/span").click()
        driver.find_element_by_name("address").clear()
        driver.find_element_by_name("address").send_keys("Daly City, CA 94014")
        driver.find_element_by_css_selector("button.btn.btn-primary").click()
        driver.find_element_by_xpath("//div[@id='app-base-id']/div[2]/div/div/div[2]/div/div/div/div/div/a[2]/span").click()
        driver.find_element_by_xpath("//div[@id='app-base-id']/div[2]/div/div/div[2]/div/div/div/div/div/a[3]/span").click()
        driver.find_element_by_css_selector("a.btn.btn-default > span").click()
        driver.find_element_by_link_text("Measure S").click()
    
    def is_element_present(self, how, what):
        try: self.driver.find_element(by=how, value=what)
        except NoSuchElementException as e: return False
        return True
    
    def is_alert_present(self):
        try: self.driver.switch_to_alert()
        except NoAlertPresentException as e: return False
        return True
    
    def close_alert_and_get_its_text(self):
        try:
            alert = self.driver.switch_to_alert()
            alert_text = alert.text
            if self.accept_next_alert:
                alert.accept()
            else:
                alert.dismiss()
            return alert_text
        finally: self.accept_next_alert = True
    
    def tearDown(self):
        self.driver.quit()
        self.assertEqual([], self.verificationErrors)

if __name__ == "__main__":
    unittest.main()
