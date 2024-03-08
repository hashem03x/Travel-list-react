import { useState } from "react";
import "./App.css";

function App() {
  const [items, setItems] = useState([]);
  function handleAddItems(item) {
    setItems((items) => [...items, item]);
  }

  function handleDeleteItems(id) {
    setItems((items) => items.filter((item) => item.id !== id));
  }

  function handlePackedItems(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  function handleClearList() {
    const confirmed = window.confirm(
      "Are you sure you want to delete all the items?"
    );
    if (confirmed) setItems([]);
  }

  return (
    <div className="app">
      <Logo />
      <Form onAddItem={handleAddItems} />
      <PackingList
        onPackItems={handlePackedItems}
        onDeleteItems={handleDeleteItems}
        onClearList={handleClearList}
        items={items}
      />
      <Stats items={items} />
    </div>
  );
}
export default App;

function Logo() {
  return <h1>🌴 Far Away 🎒</h1>;
}

function Form({ onAddItem }) {
  const [quantity, setQuantity] = useState(1);
  const [description, setDescription] = useState("");
  function handleSubmit(e) {
    e.preventDefault();
    if (!description) return;
    const newItem = { description, quantity, packed: false, id: Date.now() };
    onAddItem(newItem);
    setDescription("");
    setQuantity(1);
  }
  return (
    <form onSubmit={handleSubmit} className="add-form">
      <h3>What Do You Need For Your Trip?😍</h3>
      <select value={quantity} onChange={(e) => setQuantity(e.target.value)}>
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        type="text"
        placeholder="Item..."
      />
      <button>ADD</button>
    </form>
  );
}

function PackingList({ items, onDeleteItems, onPackItems, onClearList }) {
  const [sortBy, setSortBy] = useState("input");

  let sortedItems;

  if (sortBy === "input") sortedItems = items;

  if (sortBy === "desc")
    sortedItems = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));

  if (sortBy === "status")
    sortedItems = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));

  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => (
          <Item
            onPackItem={onPackItems}
            onDeleteItems={onDeleteItems}
            key={item.id}
            item={item}
          />
        ))}
      </ul>
      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value={"desc"}>SORT BY DESCRIPTION</option>
          <option value={"input"}>SORT BY Input order</option>
          <option value={"status"}>SORT BY packed status</option>
        </select>
        <button onClick={onClearList}>Clear List</button>
      </div>
    </div>
  );
}

function Item({ item, onDeleteItems, onPackItem }) {
  return (
    <li>
      <input
        type="checkbox"
        value={item.packed}
        onChange={() => onPackItem(item.id)}
      />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={() => onDeleteItems(item.id)}>❌</button>
    </li>
  );
}

function Stats({ items }) {
  if (!items.length)
    return (
      <p className="stats">
        <em>Start adding some items to your packing list 🚀 </em>
      </p>
    );
  const numItems = items.length;
  const numPacked = items.filter((item) => item.packed).length;
  const percentage = Math.round((numPacked / numItems) * 100);
  return (
    <footer className="stats">
      <em>
        {percentage === 100
          ? "You got everything! Ready to go ✈️"
          : `You Have ${numItems} Items On Your List, And You Already Packed
        ${numPacked} (${percentage}%)`}
      </em>
    </footer>
  );
}
