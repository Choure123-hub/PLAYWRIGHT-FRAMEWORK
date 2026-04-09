@amazon-main
Feature: Amazon Search, Cart, and Login Functionality

  Background:
    Given I navigate to the Amazon homepage
@TC-01
  Scenario: Login to Amazon with credentials
    When I login with valid credentials
    Then I should see the account page
    And I logout
@TC-02
  Scenario: Search for a product on Amazon
    When I search for "laptop" on Amazon
    Then I should see Amazon search results for "laptop"
@TC-03
  Scenario: View empty cart as a user
    When I click on the Amazon Cart button
    Then I should be redirected to the Amazon cart page
    And I should see the Amazon empty cart message

@TC-04
  Scenario: Login, add a product to cart, and logout
    When I login with valid credentials
    And I search for "pencil" on Amazon
    And I click on the first search result
    And I add the product to the cart
    Then I logout