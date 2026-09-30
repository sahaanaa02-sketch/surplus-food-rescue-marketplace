import { useState } from "react";
import { C, S, badge } from "../theme";

const U = id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=70`;

export const PHOTO = {
  bread: U("1509440159596-0249088772ff"),
  croissant: U("1555507036-ab1f4038808a"),
  pizza: U("1565299624946-b28f40a0ae38"),
  sushi: U("1579871494447-9811cf80d66c"),
  burger: U("1568901346375-23c9450c58cd"),
  donut: U("1551024506-0bccd828d307"),
  cake: U("1578985545062-69928b1d9587"),
  pancake: U("1567620905732-2d1ec7ab7445"),
  sandwich: U("1528735602780-2552fd46c7af"),
  salad: U("1512621776951-a57141f2eefd"),
  fruit: U("1610832958506-aa56368176cf"),
  curry: U("1565557623262-b51c2513a641"),
  veg: U("1540420773420-3366772f4999"),
  grocery: U("1542838132-92c53300491e"),
  meal: U("1546069901-ba9599a7e63c"),
  kitchen: U("1556910103-1c02745aae4d"),
  restaurant: U("1414235077428-338989a2e8c0"),
};

export const CATS = ["Bakery", "Meals", "Groceries", "Desserts", "Snacks"];
export const CAT_EMOJI = { Bakery: "🥖", Meals: "🍛", Groceries: "🥗", Desserts: "🍰", Snacks: "🥪" };

// [regex, photo key, category]. Backend la category illa, athanaala peyar/description la irunthu kandu pidikkurom
const RULES = [
  [/croissant/, "croissant", "Bakery"],
  [/bread|loaf|baguette|bun|sourdough|bakery|cinnamon/, "bread", "Bakery"],
  [/pizza|lasagna|pasta/, "pizza", "Meals"],
  [/sushi/, "sushi", "Meals"],
  [/burger/, "burger", "Snacks"],
  [/donut/, "donut", "Desserts"],
  [/cake|cupcake|cheesecake|brownie|tart|cookie/, "cake", "Desserts"],
  [/pancake|ice cream/, "pancake", "Desserts"],
  [/sandwich|wrap|shawarma|samosa|fries/, "sandwich", "Snacks"],
  [/salad/, "salad", "Meals"],
  [/fruit/, "fruit", "Groceries"],
  [/biryani|curry|rice|kottu|noodle|paneer|hopper|chicken|fish/, "curry", "Meals"],
  [/vegetable|greens|veg|root|soup/, "veg", "Groceries"],
  [/grocer|dairy|egg|bundle/, "grocery", "Groceries"],
];

export function info(o) {
  const t = ((o.item || "") + " " + (o.description || "")).toLowerCase();
  const r = RULES.find(([re]) => re.test(t));
  return { key: r ? r[1] : "meal", cat: r ? r[2] : "Meals" };
}
export const guess = o => info(o).cat;

export function timeLeft(end) {
  const ms = new Date(end) - new Date();
  if (ms <= 0) return null;
  const m = Math.floor(ms / 60000);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  return h < 24 ? `${h}h ${m % 60}m` : `${Math.floor(h / 24)}d ${h % 24}h`;
}

// photo load aagala na gradient + emoji kaattum
export function FoodImg({ k, cat = "Meals", alt = "" }) {
  const [bad, setBad] = useState(false);
  if (bad || !PHOTO[k]) {
    return (
      <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", fontSize: 56, background: `linear-gradient(135deg, #14532d, ${C.card2})` }}>
        {CAT_EMOJI[cat] || "🍽️"}
      </div>
    );
  }
  return (
    <img src={PHOTO[k]} alt={alt} loading="lazy" onError={() => setBad(true)}
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
  );
}

// onReserve kuduthaa Reserve button varum; children (Delete button maathiri) kuduthaa athai kaattum
export default function OfferCard({ o, onReserve, children }) {
  const { key, cat } = info(o);
  const left = timeLeft(o.pickup_end);
  const off = Math.round((1 - o.discounted_price / o.original_price) * 100);
  const ok = o.quantity > 0 && !!left;

  return (
    <div className="lift" style={{ ...S.card, padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ height: 180, position: "relative" }}>
        <FoodImg k={key} cat={cat} alt={o.item} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 55%, #000a)" }} />
        <span style={{ ...badge(C.green), position: "absolute", top: 12, left: 12, background: "#052e16" }}>{off}% OFF</span>
        <span style={{ ...badge(o.quantity > 0 ? C.amber : C.red), position: "absolute", top: 12, right: 12, background: "#1c1503" }}>
          {o.quantity > 0 ? `${o.quantity} left` : "Sold out"}
        </span>
        <span style={{ position: "absolute", bottom: 10, left: 14, fontSize: 12, fontWeight: 700, color: "#fff" }}>{cat}</span>
      </div>

      <div style={{ padding: 18, display: "grid", gap: 8, flex: 1, alignContent: "start" }}>
        <h3 style={{ margin: 0, fontSize: 18 }}>{o.item}</h3>
        <p style={{ color: C.muted, margin: 0, fontSize: 14 }}>{o.description}</p>
        <div>
          <b style={{ color: C.green, fontSize: 26 }}>₹{o.discounted_price}</b>{" "}
          <s style={{ color: C.muted }}>₹{o.original_price}</s>
        </div>
        <small style={{ color: C.muted }}>📍 {o.pickup_location}</small>
        <small style={{ color: left ? C.amber : C.red, fontWeight: 600 }}>⏳ {left ? `Closes in ${left}` : "Expired"}</small>
        <small style={{ color: "#5f7a6c" }}>ID: {o.offer_id}</small>

        {onReserve && (
          <button style={{ ...S.btn, marginTop: 6, opacity: ok ? 1 : 0.4 }} disabled={!ok} onClick={() => onReserve(o)}>
            {ok ? "Reserve Meal" : !left ? "Expired" : "Sold out"}
          </button>
        )}
        {children}
      </div>
    </div>
  );
}