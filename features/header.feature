Feature: Site Header
  As a shopper
  I want a persistent header on every page
  So that I can navigate to the home page or cart at any time

  Background:
    Given I am on the home page

  Scenario: Logo is visible in the header
    Then I should see "SampleShop" in the header

  Scenario: Cart icon is present in the header
    Then the header should contain a cart link

  Scenario: Cart badge is hidden when the cart is empty
    Then the cart badge should not be visible
