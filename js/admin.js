const API = "https://68fae18894ec96066023c657.mockapi.io/api/v2/products";

document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("productList");
  const form = document.getElementById("addForm");

  let products = [];
  let editId = null;

  const stockCheckboxes = form.querySelectorAll(".stock-checkbox");
  stockCheckboxes.forEach((cb) => {
    cb.addEventListener("change", (e) => {
      if (e.target.checked) {
        stockCheckboxes.forEach((other) => {
          if (other !== e.target) other.checked = false;
        });
      }
    });
  });

  const discountCheckbox = form.querySelector("input[name='isDiscounted']");
  const discountField = form.querySelector(".discount-field");

  discountCheckbox.addEventListener("change", () => {
    discountField.classList.toggle("hidden", !discountCheckbox.checked);
  });

  const ratingCheckbox = form.querySelector("input[name='hasRating']");
  const ratingField = form.querySelector(".rating-field");

  ratingCheckbox.addEventListener("change", () => {
    ratingField.classList.toggle("hidden", !ratingCheckbox.checked);
  });

  function createCard(p) {
    const stockHtml =
      p.inStock === false
        ? `<span class="bg-[#ffe2e5] font-bold text-sm text-center text-[#f64e60] w-[120px] h-[18px] rounded-[15px] mb-2 flex items-center justify-center">
          Нет в наличии
        </span>`
        : "";

    const discountBadge = p.isDiscounted
      ? `<span class="absolute bottom-0 ml-3 bg-[#fff7fc] font-bold text-base text-[#f00] w-[51px] h-[22px] rounded-[15px] flex items-center justify-center">
          -${p.discountPercent || 0}%
        </span>`
      : "";

    const ratingHtml = p.rating
      ? `<div class="flex gap-1 mt-2">
           ${Array.from(
             { length: 5 },
             (_, i) => `
             <i class="fa-star ${
               i < p.rating ? "fas text-yellow-400" : "far"
             }"></i>
           `
           ).join("")}
         </div>`
      : "";

    const card = document.createElement("div");
    card.className =
      "rounded-lg shadow-sm hover:shadow-lg transition-transform duration-300 flex flex-col relative bg-white p-2";

    card.innerHTML = `
      <div class="overflow-hidden relative">
        ${discountBadge}
        <img src="${
          p.image_url || "https://via.placeholder.com/200x200"
        }" alt="${p.description}" class="mx-auto h-44 sm:h-48 object-cover" />
      </div>
      <div class="p-2 flex-1 flex flex-col justify-between">
        <h3 class="font-normal text-[15px] leading-[128%] text-black mb-1">${
          p.description
        }</h3>
        ${stockHtml}
        <div class="flex flex-col items-start mb-2">
          <span class="font-bold text-base text-[#212427]">${(
            p.price_uzs || 0
          ).toLocaleString()} сум</span>
        </div>
        ${ratingHtml}
        <div class="flex gap-2 mt-2">
          <button data-id="${
            p.id
          }" class="editBtn cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">Редактировать</button>
          <button data-id="${
            p.id
          }" class="deleteBtn cursor-pointer bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">Удалить</button>
        </div>
      </div>
    `;
    return card;
  }

  function renderProducts() {
    list.innerHTML = "";
    products.forEach((p) => list.appendChild(createCard(p)));
  }

  async function fetchProducts() {
    try {
      const res = await fetch(API);
      products = await res.json();
      renderProducts();
    } catch (err) {
      console.error("Ошибка: товары не загружены", err);
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const inStockChecked = form.querySelector(".stock-checkbox:checked");
    const inStockValue = inStockChecked
      ? inStockChecked.value === "true"
      : false;

    const productData = {
      description: form.description.value.trim(),
      price_uzs: Number(form.price.value),
      image_url: form.image_url.value.trim(),
      tags: form.tags.value
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      inStock: inStockValue,
      isDiscounted: discountCheckbox.checked,
      discountPercent: discountCheckbox.checked
        ? Number(form.discountPercent.value)
        : 0,
      rating: ratingCheckbox.checked ? Number(form.rating.value) : null,
    };

    try {
      if (editId) {
        await fetch(`${API}/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
        editId = null;
        form.querySelector("button[type='submit']").textContent = "Добавить";
      } else {
        await fetch(API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
      }

      form.reset();
      discountField.classList.add("hidden");
      ratingField.classList.add("hidden");
      fetchProducts();
    } catch (err) {
      console.error("Ошибка при сохранении", err);
    }
  });

  list.addEventListener("click", async (e) => {
    const id = e.target.dataset.id;
    if (!id) return;

    if (e.target.classList.contains("deleteBtn")) {
      if (!confirm("Удалить этот товар?")) return;
      await fetch(`${API}/${id}`, { method: "DELETE" });
      fetchProducts();
      return;
    }

    if (e.target.classList.contains("editBtn")) {
      const res = await fetch(`${API}/${id}`);
      const p = await res.json();

      form.description.value = p.description || "";
      form.price.value = p.price_uzs || "";
      form.image_url.value = p.image_url || "";
      form.tags.value = p.tags?.join(", ") || "";

      stockCheckboxes.forEach((cb) => (cb.checked = false));
      if (p.inStock === true)
        form.querySelector(".stock-checkbox[value='true']").checked = true;
      if (p.inStock === false)
        form.querySelector(".stock-checkbox[value='false']").checked = true;

      discountCheckbox.checked = !!p.isDiscounted;
      discountField.classList.toggle("hidden", !discountCheckbox.checked);
      form.discountPercent.value = p.discountPercent || "";

      ratingCheckbox.checked = !!p.rating;
      ratingField.classList.toggle("hidden", !ratingCheckbox.checked);
      form.rating.value = p.rating || "";

      editId = id;
      form.querySelector("button[type='submit']").textContent = "Сохранить";
    }
  });

  fetchProducts();
});
