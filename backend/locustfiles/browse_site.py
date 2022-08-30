from locust import HttpUser, task, between
from random import randint


class WebsiteUser(HttpUser):
    wait_time = between(1, 5)

    @task(2)
    def view_products(self):
        self.client.get("/api/prodotti/", name="/api/prodotti")

    @task(4)
    def view_product(self):
        product_id = randint(21, 23)
        self.client.get(f"/api/prodotti/{product_id}", name="/api/prodotti/:id")
