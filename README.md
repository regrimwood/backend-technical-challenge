# iTICKET Backend Technical Challenge

In our system we have a feature where discounts become available to a user based on the tickets in their cart.

We would like you to create an API that gives access to a basic shopping cart and discounts that can be applied to the cart.

We are hear to help. Please ask questions and talk us through your thought process.

## Constraints
- Use a node.js framework of your choice (we use fastify).
- Use a database of your choice (any model).
- Use git version control.
- Write Unit tests etc where appropriate.

## Requirements
The API should allow the client to:
  - Add and remove tickets from the cart.
  - Get a list of discounts that can be applied to the cart in it's current state.
  - Apply a discount to the cart.
  - Not let the cart get into an invalid state.

## Discounts Combos
 - **Group Discount:** 4 or more Adults (10% discount)
 - **Family Discount:** 2 Adults and 2 to 3 Children (Set Price of $70)
