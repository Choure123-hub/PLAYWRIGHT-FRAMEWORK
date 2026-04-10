Feature: Restful Booker API Tests
  As an API consumer
  I want to interact with the Restful Booker API
  So that I can verify booking CRUD operations work correctly

  @API-01
  Scenario: Create and retrieve a booking successfully
    When I create a new booking for "John" "Doe"
    Then the booking response should be successful
    And I should be able to retrieve the created booking to verify the details

  @API-02
  Scenario: Attempt to retrieve a non-existent booking
    When I attempt to retrieve a booking with an invalid ID 99999999
    Then the API response status should be 404

  @API-03
  Scenario: Verify the exact details of a newly created booking
    When I create a new booking for "Alice" "Wonderland"
    Then the booking response should be successful
    And the retrieved booking details should match firstname "Alice" and lastname "Wonderland"
