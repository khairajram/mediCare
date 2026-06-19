const assert = require("assert");

const BASE_URL = "http://localhost:3000";

async function runTests() {
  console.log("🚀 Starting integration tests against local dev server...");

  // 1. Admin Login
  console.log("\n🔑 Testing Admin Login...");
  const adminLoginRes = await fetch(`${BASE_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      phoneNo: "9876543210",
      password: "adminpassword123"
    })
  });
  assert.strictEqual(adminLoginRes.status, 200, "Admin login failed!");
  const adminCookie = adminLoginRes.headers.get("set-cookie") || "";
  const adminToken = adminCookie.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1];
  assert.ok(adminToken, "Admin token cookie not found!");
  const adminData = await adminLoginRes.json();
  console.log("✅ Admin logged in successfully:", adminData.admin.name);

  // 2. User Login
  console.log("\n🔑 Testing User Login...");
  const userLoginRes = await fetch(`${BASE_URL}/api/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      phoneNo: "1234567890",
      password: "1234567890"
    })
  });
  assert.strictEqual(userLoginRes.status, 200, "User login failed!");
  const userCookie = userLoginRes.headers.get("set-cookie") || "";
  const userToken = userCookie.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1];
  assert.ok(userToken, "User token cookie not found!");
  console.log("✅ User logged in successfully!");

  // 3. User checks profile & gets pets
  console.log("\n🐾 Fetching User Profile & Pets...");
  const profileRes = await fetch(`${BASE_URL}/api/me`, {
    headers: { "Cookie": `token=${userToken}` }
  });
  assert.strictEqual(profileRes.status, 200);
  const profileData = await profileRes.json();
  const userId = profileData.user.id;
  assert.ok(userId, "Failed to get user ID from session");

  const petRes = await fetch(`${BASE_URL}/api/pet?userId=${userId}`, {
    headers: { "Cookie": `token=${userToken}` }
  });
  assert.strictEqual(petRes.status, 200);
  const petData = await petRes.json();
  assert.ok(petData.pets && petData.pets.length > 0, "No pets found for John Doe!");
  const petId = petData.pets[0].id;
  console.log(`✅ Fetched pets. First pet: ${petData.pets[0].name} (${petId})`);

  // 4. Fetch available Medicines to get a medicine ID
  console.log("\n💊 Fetching Medicines Master list...");
  const medRes = await fetch(`${BASE_URL}/api/MedicineRecord/medicineMaster`, {
    headers: { "Cookie": `token=${userToken}` }
  });
  assert.strictEqual(medRes.status, 200);
  const medData = await medRes.json();
  assert.ok(medData.medicines && medData.medicines.length > 0, "No medicines in stock!");
  
  // Let's order "Paracetamol Vet Tablets" (should be the first one, let's find it)
  const paracetamol = medData.medicines.find(m => m.name.includes("Paracetamol"));
  assert.ok(paracetamol, "Paracetamol not found in database!");
  console.log(`✅ Found product: ${paracetamol.name} (Qty: ${paracetamol.quantityInStock}, Price: ₹${paracetamol.price})`);

  // 5. User places an Order
  console.log("\n📦 User placing an order for Paracetamol...");
  const orderRes = await fetch(`${BASE_URL}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `token=${userToken}`
    },
    body: JSON.stringify({
      petId,
      deliveryAddress: "12, Karni Nagar, Jodhpur",
      lat: 26.2389,
      lng: 73.0243,
      notes: "Please call before arrival",
      items: [
        { medicineId: paracetamol.id, quantity: 2 }
      ]
    })
  });
  assert.strictEqual(orderRes.status, 201, "Order placement failed!");
  const orderData = await orderRes.json();
  const orderId = orderData.order.id;
  console.log(`✅ Order placed successfully! ID: ${orderId}, Total: ₹${orderData.order.totalCost}`);

  // 6. Admin views the Order
  console.log("\n📦 Admin fetching all orders...");
  const adminOrdersRes = await fetch(`${BASE_URL}/api/orders`, {
    headers: { "Cookie": `token=${adminToken}` }
  });
  assert.strictEqual(adminOrdersRes.status, 200);
  const adminOrdersData = await adminOrdersRes.json();
  const placedOrder = adminOrdersData.orders.find(o => o.id === orderId);
  assert.ok(placedOrder, "Placed order was not found in admin orders list!");
  assert.strictEqual(placedOrder.status, "PENDING", "Order should be PENDING!");
  console.log("✅ Admin successfully verified order state is PENDING.");

  // 7. Admin updates order status to PACKING -> SHIPPED -> DELIVERED
  console.log("\n🚚 Progressing order delivery status...");
  
  // PACKING
  const packRes = await fetch(`${BASE_URL}/api/orders/${orderId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `token=${adminToken}`
    },
    body: JSON.stringify({ status: "PACKING" })
  });
  assert.strictEqual(packRes.status, 200);
  console.log("✅ Admin set status to PACKING");

  // SHIPPED
  const shipRes = await fetch(`${BASE_URL}/api/orders/${orderId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `token=${adminToken}`
    },
    body: JSON.stringify({ status: "SHIPPED" })
  });
  assert.strictEqual(shipRes.status, 200);
  console.log("✅ Admin set status to SHIPPED");

  // DELIVERED (Deducts stock!)
  const deliverRes = await fetch(`${BASE_URL}/api/orders/${orderId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `token=${adminToken}`
    },
    body: JSON.stringify({ status: "DELIVERED" })
  });
  assert.strictEqual(deliverRes.status, 200);
  console.log("✅ Admin set status to DELIVERED (Order completed & COD payment received)");

  // 8. Verify medicine stock has decremented
  console.log("\n💊 Verifying medicine stock level has decremented...");
  const medVerifyRes = await fetch(`${BASE_URL}/api/MedicineRecord/medicineMaster`, {
    headers: { "Cookie": `token=${adminToken}` }
  });
  const medVerifyData = await medVerifyRes.json();
  const paracetamolUpdated = medVerifyData.medicines.find(m => m.id === paracetamol.id);
  const expectedStock = paracetamol.quantityInStock - 2;
  assert.strictEqual(paracetamolUpdated.quantityInStock, expectedStock, "Medicine stock did not decrement correctly!");
  console.log(`✅ Stock verified. Old stock: ${paracetamol.quantityInStock}, New stock: ${paracetamolUpdated.quantityInStock} (Decremented by 2)`);

  // 9. User books a grooming appointment
  console.log("\n📅 User booking a grooming appointment...");
  const apptRes = await fetch(`${BASE_URL}/api/appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `token=${userToken}`
    },
    body: JSON.stringify({
      petId,
      type: "GROOMING_BATHING",
      date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      notes: "Likes warm baths only"
    })
  });
  assert.strictEqual(apptRes.status, 201, "Appointment booking failed!");
  const apptData = await apptRes.json();
  const apptId = apptData.appointment.id;
  console.log(`✅ Appointment booked successfully! ID: ${apptId}`);

  // 10. Admin approves and completes the appointment
  console.log("\n📅 Admin approving and completing the booking...");
  const approveRes = await fetch(`${BASE_URL}/api/appointments/${apptId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `token=${adminToken}`
    },
    body: JSON.stringify({ status: "APPROVED" })
  });
  assert.strictEqual(approveRes.status, 200);
  console.log("✅ Admin set booking status to APPROVED");

  const completeRes = await fetch(`${BASE_URL}/api/appointments/${apptId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `token=${adminToken}`
    },
    body: JSON.stringify({ status: "COMPLETED" })
  });
  assert.strictEqual(completeRes.status, 200);
  console.log("✅ Admin set booking status to COMPLETED");

  // 11. User submits feedback and support tickets
  console.log("\n💬 User submitting platform feedback and support tickets...");
  const feedbackRes = await fetch(`${BASE_URL}/api/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `token=${userToken}`
    },
    body: JSON.stringify({
      rating: 5,
      comment: "Excellent glassmorphic UI overhaul! The order system is super smooth."
    })
  });
  assert.strictEqual(feedbackRes.status, 201);
  console.log("✅ User feedback review submitted");

  const ticketRes = await fetch(`${BASE_URL}/api/support`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `token=${userToken}`
    },
    body: JSON.stringify({
      subject: "Inquiry about vaccination schedules",
      message: "Do you offer booster vaccines for Persian cats?"
    })
  });
  assert.strictEqual(ticketRes.status, 201);
  const ticketData = await ticketRes.json();
  const ticketId = ticketData.ticket.id;
  console.log(`✅ User support ticket raised. ID: ${ticketId}`);

  // 12. Admin replies to ticket
  console.log("\n💬 Admin replying to support ticket...");
  const replyRes = await fetch(`${BASE_URL}/api/support/${ticketId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `token=${adminToken}`
    },
    body: JSON.stringify({
      status: "RESOLVED",
      adminResponse: "Yes, we offer feline rabies and booster shots. Please book a Vet Consultation appointment."
    })
  });
  assert.strictEqual(replyRes.status, 200);
  console.log("✅ Admin responded to the ticket and set status to RESOLVED");

  // 13. Admin checks Activity Logs
  console.log("\n🕒 Admin viewing recent system activity logs...");
  const logRes = await fetch(`${BASE_URL}/api/activity`, {
    headers: { "Cookie": `token=${adminToken}` }
  });
  assert.strictEqual(logRes.status, 200);
  const logData = await logRes.json();
  assert.ok(logData.logs && logData.logs.length > 0, "No audit logs found!");
  console.log(`✅ Fetched system logs. Count: ${logData.logs.length}`);
  console.log(`Latest activity action: "${logData.logs[0].action}" -> ${logData.logs[0].details}`);

  console.log("\n🎉 ALL LOCAL API INTEGRATION TESTS PASSED SUCCESSFULLY! Flawless execution.");
}

runTests().catch(err => {
  console.error("\n❌ TEST FAILURE:", err);
  process.exit(1);
});
