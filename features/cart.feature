Feature: Shopping Cart
  As a shopper
  I want to manage items in my cart
  So that I can review my order before checkout

  Scenario: Empty cart shows appropriate message
    Given I am on the home page
    When I navigate to the cart page
    Then I should see "Your cart is empty" on the page
    And I should see "Continue shopping" on the page

  Scenario: Cart displays a product added from the details page
    Given I navigate to product with id "1"
    And I click the "Add to Cart" button
    When I navigate to the cart page
    Then I should see "Wireless Noise-Cancelling Headphones" on the page
    And I should see the subtotal

  Scenario: Changing quantity updates the line total
    Given I navigate to product with id "1"
    And I click the "Add to Cart" button
    And I navigate to the cart page
    When I change the quantity of the first item to "2"
    Then the line total should be "$159.98"

  Scenario: Removing the only cart item shows empty state
    Given I navigate to product with id "1"
    And I click the "Add to Cart" button
    And I navigate to the cart page
    When I remove the first item from the cart
    Then I should see "Your cart is empty" on the page

  Scenario: Cart persists when navigating away and returning
    Given I navigate to product with id "1"
    And I click the "Add to Cart" button
    When I navigate to the home page
    And I navigate to the cart page
    Then I should see "Wireless Noise-Cancelling Headphones" on the page

  Scenario: Checkout button is visible in a non-empty cart
    Given I navigate to product with id "1"
    And I click the "Add to Cart" button
    And I navigate to the cart page
    Then I should see "Proceed to Checkout" on the page
