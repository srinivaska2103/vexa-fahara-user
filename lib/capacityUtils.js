/**
 * Capacity Calculation Utility for Frontend
 * Calculates capacity limits and validates guest counts consistently with the backend.
 */

function parseNumber(val) {
  if (val === null || val === undefined || val === '') return null;
  const num = Number(val);
  return Number.isFinite(num) && num > 0 ? num : null;
}

export function calculateAllowedGuestCount({
  cafe,
  selectedTable,
  cafePackage,
  eventService,
  inclusions = []
} = {}) {
  const limits = [];

  // 1. Cafe maximum physical capacity
  const cafeLimit = parseNumber(cafe?.maximum_persons);
  if (cafeLimit !== null) {
    limits.push({
      type: 'CAFE',
      label: 'Cafe capacity',
      limit: cafeLimit,
      description: `Cafe capacity: ${cafeLimit} guests`,
    });
  }

  // 2. Selected table capacity (strictly applied only if table is selected)
  if (selectedTable && parseNumber(selectedTable.capacity) !== null) {
    const tableLimit = parseNumber(selectedTable.capacity);
    limits.push({
      type: 'TABLE',
      label: 'Selected table',
      limit: tableLimit,
      description: `Table ${selectedTable.table_number || selectedTable.name || ''}: ${tableLimit} guests`,
    });
  }

  // 3. Cafe Event Package guest limit
  if (cafePackage) {
    let pkgMax = parseNumber(cafePackage.maximum_persons || cafePackage.max_guests);
    if (pkgMax === null && cafePackage.inclusions && typeof cafePackage.inclusions === 'object' && !Array.isArray(cafePackage.inclusions)) {
      pkgMax = parseNumber(cafePackage.inclusions.maximum_persons || cafePackage.inclusions.max_guests);
    }
    if (pkgMax !== null) {
      limits.push({
        type: 'CAFE_PACKAGE',
        label: 'Selected package',
        limit: pkgMax,
        description: `Selected package: Up to ${pkgMax} guests`,
      });
    }
  }

  // 4. Event Manager Package guest limit
  if (eventService) {
    const emPkgMax = parseNumber(
      eventService.max_guests ||
      eventService.maximum_persons ||
      eventService.originalEvent?.max_guests ||
      eventService.originalEvent?.maximum_persons
    );
    if (emPkgMax !== null) {
      limits.push({
        type: 'EVENT_MANAGER_PACKAGE',
        label: 'Selected Event Manager package',
        limit: emPkgMax,
        description: `Selected Event Manager package: Up to ${emPkgMax} guests`,
      });
    }

    // 5. Inclusions / Tiers restrictions
    const rawInclusions = inclusions || eventService.selectedInclusions || [];
    const incList = Array.isArray(rawInclusions) ? rawInclusions : [];
    incList.forEach((inc, idx) => {
      const incMax = parseNumber(inc?.max_guests || inc?.tier?.max_guests);
      if (incMax !== null) {
        const incName = inc.name || inc.itemName || inc.inclusionName || `Inclusion #${idx + 1}`;
        limits.push({
          type: 'INCLUSION_TIER',
          label: `${incName}`,
          limit: incMax,
          description: `${incName}: Up to ${incMax} guests`,
        });
      }
    });
  }

  // Calculate minimum of all applicable limits
  let maximumAllowedGuests = null;
  let bindingConstraint = null;

  if (limits.length > 0) {
    let minLimit = Infinity;
    limits.forEach((item) => {
      if (item.limit < minLimit) {
        minLimit = item.limit;
        bindingConstraint = item;
      }
    });
    maximumAllowedGuests = minLimit === Infinity ? null : minLimit;
  }

  return {
    cafeLimit,
    tableLimit: selectedTable ? parseNumber(selectedTable.capacity) : null,
    cafePackageLimit: cafePackage ? parseNumber(cafePackage.maximum_persons || cafePackage.max_guests) : null,
    eventManagerLimit: eventService ? parseNumber(eventService.max_guests || eventService.maximum_persons || eventService.originalEvent?.max_guests) : null,
    maximumAllowedGuests,
    bindingConstraint,
    limits,
  };
}

export function validateGuestCount(guestCount, capacityInfo) {
  const count = Number(guestCount);
  if (!Number.isInteger(count) || count < 1) {
    return {
      isValid: false,
      code: 'INVALID_GUEST_COUNT',
      message: 'Guest count must be at least 1.',
      maxAllowed: capacityInfo.maximumAllowedGuests,
    };
  }

  const { limits, maximumAllowedGuests, bindingConstraint } = capacityInfo;

  for (const item of limits) {
    if (count > item.limit) {
      let message = `You've reached the maximum guest limit of ${item.limit} for ${item.label.toLowerCase()}.`;
      if (item.type === 'CAFE') {
        message = `Requested guest count (${count}) exceeds cafe maximum capacity of ${item.limit} guests.`;
      } else if (item.type === 'TABLE') {
        message = `Requested guest count (${count}) exceeds selected table capacity of ${item.limit} guests.`;
      } else if (item.type === 'CAFE_PACKAGE') {
        message = `Requested guest count (${count}) exceeds selected cafe package limit of ${item.limit} guests.`;
      } else if (item.type === 'EVENT_MANAGER_PACKAGE') {
        message = `Your selected Event Manager package supports up to ${item.limit} guests. Choose a compatible package or reduce the guest count.`;
      } else if (item.type === 'INCLUSION_TIER') {
        message = `Requested guest count (${count}) exceeds the limit of ${item.limit} guests for ${item.label}.`;
      }

      return {
        isValid: false,
        code: `EXCEEDS_${item.type}_LIMIT`,
        message,
        maxAllowed: maximumAllowedGuests,
        bindingConstraint: item,
      };
    }
  }

  return {
    isValid: true,
    maxAllowed: maximumAllowedGuests,
    bindingConstraint,
  };
}
