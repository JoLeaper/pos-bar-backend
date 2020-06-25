# pos-bar-backend

# LAB: Bar Point of Sale - Phase 2
We are going to build the back-end for a Bar Point of Sale machine. The Bar POS back-end
will need to track products, inventory bottles, and orders. When an order is made, the inventory
should automatically be adjusted and our bar manager should be notified when a product we sell
is running out.
This lab is broken into multiple phases.
## Phase 2 Requirements
For phase 2 we will concentrate on the `Bottle` model.
## CRUD
Create all CRUD routes for the `Bottle` model. The `Bottle` model should include a reference to
a product, the remaining liquid in the bottle (in ml), when the bottle was purchased and when the
bottle was last poured.
* the create route will be used when a new bottle is bought
* the get all route will be used to see all available bottles (_id and product id only)
* the get by id route will be used to get details about a bottle (populate product information)
* the update route will be used to update how much liquid is in the bottle
* the delete route will be used when we discard a bottle
## Functionality
* when creating a bottle automatically set the remaining liquid to the products size
* when getting a product's details a list of all bottles associated with the product should be included
* when deleting a product also delete all bottles associated with the product
## Testing
* `supertest` to test all your routes
## Rubric
* 0.5 point per route
* 0.5 point per route test
* 1 points for populate
* 2 points for setting remaining liquid on create
* 1 point for virtual
* 1 point for deleting all bottles on product delete