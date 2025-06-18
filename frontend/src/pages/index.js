// app/page.tsx or pages/index.tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <main className="min-h-screen text-black bg-white">
      <section className="py-16 text-center">
        <h1 className="mb-4 text-5xl font-bold">Welcome to ShopVerse</h1>
        <p className="mb-6 text-lg">Discover premium products at the best price.</p>
        <Button className="text-white bg-green-600 hover:bg-green-700">Shop Now</Button>
      </section>

      <section className="grid grid-cols-1 gap-6 px-8 py-12 md:grid-cols-3">
        {[1, 2, 3].map((product) => (
          <Card key={product}>
            <CardContent className="p-4">
              <img src={`/products/product-${product}.jpg`} alt="Product" className="object-cover w-full h-48 mb-4 rounded-md" />
              <h3 className="text-xl font-semibold">Product {product}</h3>
              <p className="text-gray-600">Lorem ipsum dolor sit amet.</p>
              <Button className="w-full mt-4">Add to Cart</Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  )
}
