@amazon-product
Feature: Amazon Product Details Functionality

@TC-07
  Scenario Outline: View a product's details from search results
    Given I navigate to the Amazon homepage
    When I search for "<product_name>" on Amazon
    And I click on the first search result
    Then I should see the "<product_name>" product details page
    And I logout

    Examples:
      | product_name |
      | pencil       |
      | laptop       |

@TC-08
  Scenario: Add a product to the cart from the product details page
    Given I navigate to the Amazon homepage
    And I login with valid credentials
    When I search for "water bottle" on Amazon
    And I click on the first search result
    And I add the product to the cart
    Then I should see the product in the cart
    And I logout

@TC-09
  Scenario: Search for a product that does not exist
    Given I navigate to the Amazon homepage
    When I search for a product that does not exist
    Then I should see a "no results" message
    And I logout

@TC-10
  Scenario: Add a product to the cart and then remove it
    Given I navigate to the Amazon homepage
    And I login with valid credentials
    When I search for "water bottle" on Amazon
    And I click on the first search result
    And I add the product to the cart
    Then I should see the product in the cart
    When I remove the product from the cart
    Then I should see that the cart is empty
    And I logout