Feature: Product Details Page
  As a shopper
  I want to view the full details of a product
  So that I can make an informed purchase decision

  Scenario: Product information is displayed for a valid product
    Given I navigate to product with id "1"
    Then I should see "Wireless Noise-Cancelling Headphones" on the page
    And I should see "$79.99" on the page
    And I should see "Premium wireless headphones" on the page

  Scenario: Not found page is shown for an invalid product id
    Given I navigate to product with id "99999"
    Then I should see "Product not found." on the page
    And I should see "Back to products" on the page

  Scenario: Add to Cart and Buy Now are hidden for out-of-stock products
    Given I navigate to the out-of-stock product page
    Then the "Add to Cart" button should not be visible
    And the "Buy Now" button should not be visible

  Scenario: User adds a product to the cart and sees a confirmation message
    Given I navigate to product with id "1"
    When I click the "Add to Cart" button
    Then I should see a confirmation message

  Scenario: Cart badge updates after adding a product
    Given I navigate to product with id "1"
    When I click the "Add to Cart" button
    Then the cart badge should show "1"

  Scenario: Buy Now adds the product and navigates to the cart
    Given I navigate to product with id "1"
    When I click the "Buy Now" button
    Then the URL should be "/cart"

  Scenario: Quantity selector is capped at available stock
    Given I navigate to product with id "3"
    Then the quantity selector should have "8" options

  Scenario: Back link returns the shopper to the product list
    Given I navigate to product with id "1"
    When I click the back to products link
    Then the URL should be "/"
