@Additional
Feature: Amazon Additional Scenarios

  @TC-21
  Scenario: Complex user journey: Login, search, add to cart, remove, and logout
    Given I navigate to the Amazon homepage
    When I login with valid credentials
    Then I should be logged in successfully
    When I search for "Smart Watch" on Amazon
    Then I should see Amazon search results for "Smart Watch"
    When I click on the first search result
    Then I should see the "Smart Watch" product details page
    When I add the product to the cart
    Then I should see the product in the cart
    When I remove the product from the cart
    Then I should see that the cart is empty
    When I logout of the account
    Then I should be redirected to the sign-in page

  @TC-20
  Scenario: Complex user journey: Search, apply multiple filters, and add to cart
    Given I navigate to the Amazon homepage
    When I search for "Wireless Keyboard" on Amazon
    Then I should see Amazon search results for "Wireless Keyboard"
    When I filter the search results by 4 stars and up
    Then I should see Amazon search results for "Wireless Keyboard"
    When I filter the price range from "1000" to "3000"
    Then I should see Amazon search results for "Wireless Keyboard"
    When I click on the first search result
    Then I should see the "Wireless Keyboard" product details page
    When I add the product to the cart
    Then I should see the product in the cart

  @TC-05
  Scenario: Search for a product and apply 4 Stars & Up filter
    Given I navigate to the Amazon homepage
    When I search for "Bluetooth Speaker" on Amazon
    Then I should see Amazon search results for "Bluetooth Speaker"
    When I filter the search results by 4 stars and up
    Then I should see Amazon search results for "Bluetooth Speaker"

  @TC-06
  Scenario: Select product quantity and add to cart
    Given I navigate to the Amazon homepage
    When I search for "Water Bottle" on Amazon
    And I click on the first search result
    And I select quantity "2" and add the product to the cart
    Then I should see the product in the cart

  @TC-19
  Scenario: Search for a non-existent product and verify no results message
    Given I navigate to the Amazon homepage
    When I search for a product that does not exist
    Then I should see a "no results" message

  @TC-18
  Scenario: Intentional failure to verify reporting and screenshot capture
    Given I navigate to the Amazon homepage
    When I search for "Headphones" on Amazon
    Then I intentionally fail the test

  @TC-17
  Scenario: Search for a product and filter by a specific price range
    Given I navigate to the Amazon homepage
    When I search for "Smart Watch" on Amazon
    And I filter the price range from "1000" to "5000"
    Then I should see Amazon search results for "Smart Watch"

  @TC-16
  Scenario: Search for a product, view details, but navigate to empty cart without adding
    Given I navigate to the Amazon homepage
    When I search for "Desk Lamp" on Amazon
    And I click on the first search result
    Then I should see the "Desk Lamp" product details page
    When I click on the Amazon Cart button
    Then I should be redirected to the Amazon cart page
    And I should see the Amazon empty cart message

  @TC-15
  Scenario: Search for a product, apply filter, and verify product details page
    Given I navigate to the Amazon homepage
    When I search for "Gaming Keyboard" on Amazon
    And I filter the search results by 4 stars and up
    And I click on the first search result
    Then I should see the "Gaming Keyboard" product details page

  @TC-14
  Scenario: Add product to cart and navigate to cart via header button
    Given I navigate to the Amazon homepage
    When I search for "Headphones" on Amazon
    And I click on the first search result
    And I add the product to the cart
    And I click on the Amazon Cart button
    Then I should be redirected to the Amazon cart page
    And I should see the product in the cart
    When I remove the product from the cart
    Then I should see that the cart is empty

  @TC-13
  Scenario: Verify empty cart navigation from the homepage
    Given I navigate to the Amazon homepage
    When I click on the Amazon Cart button
    Then I should be redirected to the Amazon cart page
    And I should see the Amazon empty cart message

  @TC-12
  Scenario: End-to-end flow: Search, filter, add multiple quantities, and remove item from cart
    Given I navigate to the Amazon homepage
    When I search for "Wireless Mouse" on Amazon
    And I filter the search results by 4 stars and up
    And I click on the first search result
    Then I should see the "Wireless Mouse" product details page
    When I select quantity "2" and add the product to the cart
    Then I should see the product in the cart
    When I remove the product from the cart
    Then I should see that the cart is empty

  @TC-11
  Scenario: Select mobile product quantity and add to cart
    Given I navigate to the Amazon homepage
    When I search for "Moto phone case" on Amazon
    And I click on the first search result
    And I select quantity "2" and add the product to the cart
    Then I should see the product in the cart
