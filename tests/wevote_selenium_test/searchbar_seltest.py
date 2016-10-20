# -*- coding: utf-8 -*-
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException
import unittest, time, re

class SearchbarSeltest(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.implicitly_wait(30)
        self.base_url = "https://wevote.us/"
        self.verificationErrors = []
        self.accept_next_alert = True
    
    def test_searchbar_sel(self):
        driver = self.driver
        driver.get("https://wevote.us")
        driver.find_element_by_link_text("Ballot").click()
        driver.find_element_by_id("SearchAllBox-input").clear()
        driver.find_element_by_id("SearchAllBox-input").send_keys("engineer")
        driver.find_element_by_xpath("//button[@type='submit']").click()
        driver.find_element_by_id("SearchAllBox-input").clear()
        driver.find_element_by_id("SearchAllBox-input").send_keys("president")
        driver.find_element_by_xpath("//button[@type='submit']").click()
        driver.find_element_by_id("SearchAllBox-input").clear()
        driver.find_element_by_id("SearchAllBox-input").send_keys("karina")
        driver.find_element_by_xpath("//button[@type='submit']").click()
        driver.find_element_by_id("SearchAllBox-input").clear()
        driver.find_element_by_id("SearchAllBox-input").send_keys("oakland")
        driver.find_element_by_xpath("//button[@type='submit']").click()
        driver.find_element_by_id("SearchAllBox-input").clear()
        driver.find_element_by_id("SearchAllBox-input").send_keys("california")
        driver.find_element_by_xpath("//div[@id='app-base-id']/div/div/div/header/div[2]/div/div/a[4]/div").click()
    
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
