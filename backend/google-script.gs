
/**
 * ROOST Onboarding App Backend
 * 
 * INSTRUCTIONS:
 * 1. Create a new Google Sheet.
 * 2. Go to Extensions -> Apps Script.
 * 3. Delete any existing code and paste this entire script.
 * 4. Click 'Save'.
 * 5. Click 'Deploy' -> 'New Deployment'.
 * 6. Select 'Web App'.
 * 7. Set 'Execute as' to 'Me'.
 * 8. Set 'Who has access' to 'Anyone'.
 * 9. Click 'Deploy' and copy the 'Web App URL'.
 * 10. Paste that URL into the 'scriptUrl' variable in your App.tsx.
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const timestamp = new Date();
    const team = data.teamName || "Unnamed Team";
    
    // 1. Process Menu Items
    const menuSheet = getOrCreateSheet(ss, "1_Menu", [
      "Timestamp", "Team", "Dish Name", "Protein", "Spec", "Total Weight Req", "Daily Portion Target", "Other Ingredients"
    ]);
    if (data.menu && data.menu.length > 0) {
      data.menu.forEach(item => {
        const ingredients = (item.otherIngredients || []).map(ing => `${ing.name} (${ing.qty})`).join(", ");
        menuSheet.appendRow([
          timestamp, team, item.dishName, item.meatType, item.meatSpec, item.weightPerCut, item.dailyPortionTarget, ingredients
        ]);
      });
    }

    // 2. Process Kitchen Requirements
    const kitchenSheet = getOrCreateSheet(ss, "2_Kitchen", [
      "Timestamp", "Team", "Needs Kitchen", "Purpose", "Specific Equipment"
    ]);
    kitchenSheet.appendRow([
      timestamp, team, data.kitchen.needsKitchen ? "YES" : "NO", data.kitchen.purpose, data.kitchen.specificEquipment
    ]);

    // 3. Process Equipment (Gear)
    const equipSheet = getOrCreateSheet(ss, "3_Equipment", [
      "Timestamp", "Team", "Item", "Spec", "Qty", "Date Needed"
    ]);
    if (data.equipment && data.equipment.length > 0) {
      data.equipment.forEach(item => {
        equipSheet.appendRow([
          timestamp, team, item.item, item.spec, item.qty, item.dateNeeded
        ]);
      });
    }

    // 4. Process Fuel
    const fuelSheet = getOrCreateSheet(ss, "4_Fuel", [
      "Timestamp", "Team", "Type", "Spec", "Qty", "Date Needed"
    ]);
    if (data.fuel && data.fuel.length > 0) {
      data.fuel.forEach(item => {
        fuelSheet.appendRow([
          timestamp, team, item.type, item.spec, item.qty, item.dateNeeded
        ]);
      });
    }

    // 5. Process Protocol (Timeline)
    const protocolSheet = getOrCreateSheet(ss, "5_Timeline", [
      "Timestamp", "Team", "Activity Date/Time", "Activity", "Result/Requirements"
    ]);
    if (data.process && data.process.length > 0) {
      data.process.forEach(p => {
        protocolSheet.appendRow([
          timestamp, team, p.date, p.process, p.result
        ]);
      });
    }

    // 6. Process Staff (Crew)
    const staffSheet = getOrCreateSheet(ss, "6_Staff", [
      "Timestamp", "Team", "Full Name", "Role", "Passport #", "Passport Expiry", "DOB", "Address"
    ]);
    if (data.staff && data.staff.length > 0) {
      data.staff.forEach(person => {
        staffSheet.appendRow([
          timestamp, team, person.fullName, person.role, person.passportNumber, person.passportExpiry, person.dob, person.address
        ]);
      });
    }

    // 7. Process Travel (Flights)
    const travelSheet = getOrCreateSheet(ss, "7_Travel", [
      "Timestamp", "Team", "Outbound HUB", "Outbound Date", "Inbound HUB", "Inbound Date"
    ]);
    const f = data.flights || {};
    travelSheet.appendRow([
      timestamp, team, f.outboundAirport, f.outboundDate, f.usArrivalAirport, f.inboundDate
    ]);

    // 8. Process Accommodation (Hotel)
    const hotelSheet = getOrCreateSheet(ss, "8_Accommodation", [
      "Timestamp", "Team", "Rooms Required", "Room Spec", "Check-In", "Check-Out"
    ]);
    const h = data.hotel || {};
    hotelSheet.appendRow([
      timestamp, team, h.numRooms, h.roomSpec, h.checkIn, h.checkOut
    ]);

    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Helper to get an existing sheet or create it with headers if it doesn't exist.
 */
function getOrCreateSheet(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (headers) {
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length)
        .setFontWeight("bold")
        .setBackground("#000000")
        .setFontColor("#ffffff");
      sheet.setFrozenRows(1);
    }
  }
  return sheet;
}
