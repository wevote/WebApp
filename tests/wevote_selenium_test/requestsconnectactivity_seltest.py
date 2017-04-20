# -*- coding: utf-8 -*-
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException
import unittest, time, re

class RequestsconnectactivitySeltest(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.implicitly_wait(30)
        self.base_url = "https://wevote.us/"
        self.verificationErrors = []
        self.accept_next_alert = True
    
    def test_requestsconnectactivity_sel(self):
        driver = self.driver
        driver.get("https://wevote.us")
        driver.find_element_by_xpath("//div[@id='app-base-id']/div/div/div/header/div[2]/div[2]/a[2]/span[2]").click()
        driver.find_element_by_xpath("//div[@id='app-base-id']/div/div/div/header/div[2]/div[2]/a[3]/span[2]").click()
        driver.find_element_by_xpath("//div[@id='app-base-id']/div/div/div/header/div[2]/div[2]/a[4]/span[2]").click()
        driver.find_element_by_xpath("//div[@id='app-base-id']/div/div/div/header/div[2]/div[2]/a[3]/span[2]").click()
        driver.find_element_by_id("ADD_FRIENDS_BY_TWITTER").click()
        driver.find_element_by_id("ADD_FRIENDS_BY_FACEBOOK").click()
        driver.find_element_by_id("ADD_FRIENDS_BY_EMAIL").click()
        driver.find_element_by_link_text("See current friends").click()
        driver.find_element_by_css_selector("button.btn.btn-link").click()
        driver.find_element_by_xpath("//div[@id='app-base-id']/div/div/div/header/div[2]/div[2]/a[3]/span[2]").click()
        driver.find_element_by_link_text("See other invitations").click()
        driver.find_element_by_link_text("Connect").click()
        driver.find_element_by_css_selector("a > button.btn.btn-primary").click()
        driver.find_element_by_xpath("//button[@type='button']").click()
        driver.find_element_by_xpath("(//input[@type='text'])[2]").clear()
        driver.find_element_by_xpath("(//input[@type='text'])[2]").send_keys("greenpeace")
        driver.find_element_by_xpath("//button[@type='button']").click()
        driver.find_element_by_link_text("Following").click()
        driver.find_element_by_link_text("Friends").click()
    
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
