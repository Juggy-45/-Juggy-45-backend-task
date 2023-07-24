const util = require('util');
const fs = require('fs');

const readDistances = () => {
    const fileToRead = 'distances/distance.json';
    const file = fs.readFileSync(fileToRead);
    return JSON.parse(file);
}

const calculateCharges = (routeLength) => {
    const dist = parseFloat((routeLength / 1609.34).toFixed(2));
    
    let deliveryCharges = 7.0;
    
    if (dist < 2.5) {
        deliveryCharges = 1.0;
    } else if (dist > 2.49 && dist < 5) {
        deliveryCharges = 2.0;
    } else if (dist > 4.99 && dist < 7) {
        deliveryCharges = 3.0;
    } else if (dist < 10.01) {
        deliveryCharges = 5;
    } else {
        deliveryCharges = 10;
    }
    
    return deliveryCharges;
};

const solution = () => {
    const data = readDistances();
    const { origin_addresses: originAddresses,
            destination_addresses: destinationAddresses,
            rows: distances,
            customers
          } = data;
    
    const solution = [];
    
    // Function to add a customer to the current route
    const addCustomerToRoute = (customerIndex, route) => {
        const distanceToCustomerMeters = distances[0].elements[customerIndex].distance.value;
        const distanceToCustomerMiles = parseFloat((distanceToCustomerMeters / 1609.34).toFixed(2));
        const deliveryCharges = calculateCharges(distanceToCustomerMiles);
        route.push({
            customer: customers[customerIndex],
            deliveryCharges,
            path: `${distanceToCustomerMiles} miles from Store to ${customers[customerIndex]}.`
        });
        return distanceToCustomerMeters;
    };

    let currentRoute = [];
    let currentRouteLength = 0;
    let maxRouteLength = 8046 + (8046 * 0.3); // meters

    // Loop through all customers to find the optimal routes
    for (let i = 1; i < distances[0].elements.length; i++) {
        const distanceToCustomer = distances[0].elements[i].distance.value;
        
        if (currentRouteLength + distanceToCustomer <= maxRouteLength) {
            // If adding the current customer to the route doesn't exceed the maxRouteLength
            currentRouteLength += addCustomerToRoute(i, currentRoute);
        } else {
            // If adding the current customer to the route exceeds the maxRouteLength
            // Save the current route and start a new route with the current customer
            solution.push({
                totalLength: `${currentRouteLength} meters from Store.`,
                route: [...currentRoute]
            });

            currentRoute = [];
            currentRouteLength = addCustomerToRoute(i, currentRoute);
        }
    }

    // Add the last route to the solution
    if (currentRoute.length > 0) {
        solution.push({
            totalLength: `${currentRouteLength} meters from Store.`,
            route: [...currentRoute]
        });
    }

    return solution;
};

module.exports = {
    solution
};
