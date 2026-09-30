import { useEffect, useState } from "react";
import { C, S, badge, money } from "../theme";

const U = id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=70`;
const F = (kw, n) => `https://loremflickr.com/800/600/${kw}?lock=${n}`;

export const PHOTO = {
  bread: U("1509440159596-0249088772ff"),
  croissant: U("1555507036-ab1f4038808a"),
  pizza: U("1565299624946-b28f40a0ae38"),
  sushi: U("1579871494447-9811cf80d66c"),
  burger: U("1568901346375-23c9450c58cd"),
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

// [regex, category, unsplash key (illa na null), flickr keyword]  (specific ones mela)
const RULES = [
  [/croissant/, "Bakery", "croissant", "croissant"],
  [/sourdough/, "Bakery", null, "sourdough,bread"],
  [/baguette/, "Bakery", null, "baguette"],
  [/garlic bread/, "Bakery", null, "garlic,bread"],
  [/cinnamon/, "Bakery", null, "cinnamon,roll"],
  [/fish bun|seeni|sweet bun|\bbun\b/, "Bakery", null, "buns,bakery"],
  [/bakery box|bread|loaf/, "Bakery", "bread", "bread"],
  [/pizza/, "Meals", "pizza", "pizza"],
  [/lasagna/, "Meals", null, "lasagna"],
  [/pasta/, "Meals", null, "pasta"],
  [/sushi/, "Meals", "sushi", "sushi"],
  [/crab/, "Meals", null, "crab,curry"],
  [/biryani/, "Meals", null, "biryani"],
  [/kottu/, "Meals", null, "kottu"],
  [/noodle/, "Meals", null, "noodles"],
  [/fried rice/, "Meals", "meal", "fried,rice"],
  [/butter chicken/, "Meals", null, "butter,chicken"],
  [/fish/, "Meals", null, "fish,curry"],
  [/grilled chicken/, "Meals", null, "grilled,chicken"],
  [/string hopper|hopper/, "Meals", null, "hoppers,food"],
  [/pittu/, "Meals", null, "pittu,food"],
  [/rice and curry|rice & curry|curry/, "Meals", "curry", "rice,curry"],
  [/burger/, "Snacks", "burger", "burger"],
  [/sandwich/, "Snacks", "sandwich", "sandwich"],
  [/wrap/, "Snacks", null, "wrap,food"],
  [/shawarma/, "Snacks", null, "shawarma"],
  [/samosa/, "Snacks", null, "samosa"],
  [/vadai|vada/, "Snacks", null, "fried,snacks"],
  [/fries/, "Snacks", null, "fries"],
  [/fried chicken/, "Snacks", null, "fried,chicken"],
  [/donut/, "Desserts", null, "donuts"],
  [/cupcake/, "Desserts", null, "cupcakes"],
  [/cheesecake/, "Desserts", null, "cheesecake"],
  [/brownie/, "Desserts", null, "brownies"],
  [/watalappam|pudding/, "Desserts", null, "pudding,dessert"],
  [/ice cream/, "Desserts", null, "ice,cream"],
  [/pancake/, "Desserts", "pancake", "pancakes"],
  [/cookie/, "Desserts", null, "cookies"],
  [/tart/, "Desserts", null, "fruit,tart"],
  [/cake/, "Desserts", "cake", "cake"],
  [/fruit salad/, "Groceries", "salad", "fruit,salad"],
  [/salad/, "Meals", "salad", "salad"],
  [/fruit/, "Groceries", "fruit", "fruits"],
  [/leafy|greens/, "Groceries", null, "leafy,greens"],
  [/vegetable/, "Groceries", "veg", "vegetables"],
  [/soup/, "Groceries", null, "soup"],
  [/dairy|egg/, "Groceries", null, "eggs,milk"],
  [/grocer/, "Groceries", "grocery", "groceries"],
];

const hash = s => [...String(s)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 9973, 7);

export function info(o) {
  const name = (o.item || "").toLowerCase();
  const all = name + " " + (o.description || "").toLowerCase();
  const r = RULES.find(([re]) => re.test(name)) || RULES.find(([re]) => re.test(all));
  const srcs = [];
  if (r && r[2]) srcs.push(PHOTO[r[2]]);
  srcs.push(F(r ? r[3] : "food,meal", hash(o.item)));
  return { cat: r ? r[1] : "Meals", srcs };
}
export const guess = o => info(o).cat;

export function timeLeft(end) {
  const ms = new Date(end) - new Date();
  if (ms <= 0) return null;
  const m = Math.floor(ms / 60000);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

// ore raathiri concept: innum 24 mani neratthukkul mudiyura offers mattum
export const isTonight = o => {
  const ms = new Date(o.pickup_end) - new Date();
  return ms > 0 && ms <= 24 * 3600e3;
};

const tm = d => new Date(d).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
export function windowText(o) {
  const same = new Date(o.pickup_end).toDateString() === new Date().toDateString();
  const day = same ? "Today" : new Date(o.pickup_end).toLocaleDateString([], { month: "short", day: "numeric" });
  return `${day} ${tm(o.pickup_start)} – ${tm(o.pickup_end)}`;
}

// photo load aagala na next photo, athuvum illa na emoji
export function FoodImg({ k, srcs, cat = "Meals", alt = "" }) {
  const list = srcs || (PHOTO[k] ? [PHOTO[k]] : []);
  const [i, setI] = useState(0);
  useEffect(() => { setI(0); }, [list[0]]);
  const src = list[i];

  if (!src) {
    return (
      <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", fontSize: 56, background: `linear-gradient(135deg, #14532d, ${C.card2})` }}>
        {CAT_EMOJI[cat] || "🍽️"}
      </div>
    );
  }
  return (
    <img key={src} src={src} alt={alt} loading="lazy" onError={() => setI(i + 1)}
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
  );
}

export default function OfferCard({ o, onReserve, children }) {
  const { cat, srcs } = info(o);
  const left = timeLeft(o.pickup_end);
  const off = Math.round((1 - o.discounted_price / o.original_price) * 100);
  const ok = o.quantity > 0 && !!left;

  return (
    <div className="lift" style={{ ...S.card, padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ height: 180, position: "relative" }}>
        <FoodImg srcs={srcs} cat={cat} alt={o.item} />
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
          <b style={{ color: C.green, fontSize: 24 }}>{money(o.discounted_price)}</b>{" "}
          <s style={{ color: C.muted, fontSize: 13 }}>{money(o.original_price)}</s>
        </div>
        <small style={{ color: C.muted }}>📍 {o.pickup_location}</small>
        <small style={{ color: C.muted }}>🕒 Pickup {windowText(o)}</small>
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