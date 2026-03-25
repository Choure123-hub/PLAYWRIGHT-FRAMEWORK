@amazon-main
Feature: Amazon Search, Cart, and Login Functionality

  Background:
    Given I navigate to the Amazon homepage

  Scenario: Login to Amazon with credentials
    When I login with valid credentials
    Then I should see the account page
    And I logout

  # Scenario: Search for a product on Amazon
  #   When I search for "laptop" on Amazon
  #   Then I should see Amazon search results for "laptop"

  # Scenario: View empty cart as a user
  #   When I click on the Amazon Cart button
  #   Then I should be redirected to the Amazon cart page
  #   And I should see the Amazon empty cart message