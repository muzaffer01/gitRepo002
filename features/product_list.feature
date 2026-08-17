Feature: Product List Page
  As a shopper
  I want to browse all available products
  So that I can find items to purchase

  Background:
    Given I am on the home page

  Scenario: All 10 products are displayed by default
    Then I should see 10 product cards

  Scenario: Search filters products by name
    When I type "Wireless" in the search box
    Then I should see a product named "Wireless Noise-Cancelling Headphones"
    And I should not see a product named "Yoga Mat"

  Scenario: Category filter narrows the product list
    When I select the category "Electronics"
    Then I should see 3 product cards

  Scenario: Empty state appears when no products match the search
    When I type "zzznotfound" in the search box
    Then I should see "No products match your filters." on the page

  Scenario: Out-of-stock products display an Out of stock label
    Then I should see "Out of stock" on the page

  Scenario: Clicking a product card navigates to the detail page
    When I click on the first product card
    Then the URL should contain "/products/"
