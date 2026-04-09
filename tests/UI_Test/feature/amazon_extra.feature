@amazon-extra
Feature: Amazon Extra Features - Filtering and Navigation

  Background:
    Given I navigate to the Amazon homepage

@TC-06
  Scenario: Filter search results by Customer Review
    When I search for "headphones" on Amazon
    And I filter the search results by 4 Stars and Up
    Then I should see Amazon search results for "headphones"
  

@TC-07
  Scenario: Navigate to Gift Cards page
    When I click on the Gift Cards link in the top menu
    Then I should be redirected to the Gift Cards page