import Header from "../components/Header";
import Image from "next/dist/client/image";
import { useSelector } from "react-redux";
import CheckoutProduct from "../components/CheckoutProduct";
import { useSession } from "next-auth/react";
import { getSession } from "next-auth/react";

import { selectTotal } from "../slices/basketSlice";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const stripePromise = loadStripe(process.env.stripe_public_key); // from env.local   to next.config.js   env variables

const Checkout = () => {
  const items = useSelector((state) => state.basket.items);
  const session = useSession();
  const total = useSelector(selectTotal);
  const createCheckoutSession = async () => {
    console.log("@@@@");
    const stripe = await stripePromise;
    console.log("@@@@", session);

    // call the backend to create a checkout session
    const checkoutSession = await axios.post("api/create-checkout-session", {
      items: items,
      email: session.data.user.email,
    });
    console.log("@@@@");

    const result = await stripe.redirectToCheckout({
      sessionId: checkoutSession.data.id,
    });
    console.log("@@@@");

    if (result.error) {
      alert(result.error.message);
    }
  };
  return (
    <div className="bg-gray-100">
      <Header />
      <main className="lg:flex max-w-screen-2xl mx-auto">
        <div>
          <Image
            src="https://links.papareact.com/ikj"
            width={1020}
            height={250}
            objectFit="contain"
          />

          <div className="flex flex-col p-5 space-y-10 bg-white">
            <h1 className="text-3xl border-b pb-4">
              {items.length === 0
                ? "Your Amazon Basket is empty"
                : "Your Shopping Basket"}
            </h1>

            {items.map(
              (
                {
                  id,
                  title,
                  price,
                  description,
                  category,
                  image,
                  rating,
                  hasPrime,
                },
                i
              ) => (
                <CheckoutProduct
                  key={id}
                  id={id}
                  title={title}
                  price={price}
                  description={description}
                  category={category}
                  image={image}
                  rating={rating}
                  hasPrime={hasPrime}
                />
              )
            )}
          </div>
        </div>

        <div className="flex flex-col bg-white p-10 shadow-md">
          {items.length > 0 && (
            <>
              <h2 className="whitespace-nowrap">
                Subtotal ({items.length} items): {total}€
                <span className="font-bold">{}</span>
              </h2>

              <button
                onClick={createCheckoutSession}
                role="link"
                disabled={!session.data}
                className={`button mt-2  ${
                  !session.data &&
                  "from-gray-300 to-gray-500 border-gray-200 text-gray-300 cursor-not-allowed"
                }`}
              >
                {session.data ? "Checkout" : "Sign in to checkout"}
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Checkout;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
