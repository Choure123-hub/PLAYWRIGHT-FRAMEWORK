Feature: Amazon Product Details Functionality

  Scenario: View a product from search results
    Given I navigate to the Amazon homepage
    When I login with valid credentials
    And I search for "laptop" on Amazon
    And I click on the first search result
    Then I should see the product details page
    And I logout