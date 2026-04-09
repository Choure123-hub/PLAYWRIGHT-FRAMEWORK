@Data-Driven
Feature: Data Driven Testing with JSON

  Scenario: Search for a product using JSON data
    Given I navigate to the Amazon homepage
    When I search for the valid product from test data
    Then I should see search results for the valid product

  Scenario: Login using JSON credentials
    Given I navigate to the Amazon homepage
    When I login using standard user credentials from test data
    Then I should see the account page

  Scenario: Search for an invalid product using JSON data
    Given I navigate to the Amazon homepage
    When I search for the invalid product from test data
    Then I should see a no results message for the invalid product