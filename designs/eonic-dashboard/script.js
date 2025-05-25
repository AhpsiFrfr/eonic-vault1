// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EONIC Chart
    initEonicChart();
    
    // Initialize interactive elements
    initInteractiveElements();
});

// Function to initialize the EONIC chart
function initEonicChart() {
    const ctx = document.getElementById('eonicChart').getContext('2d');
    
    // Generate random data for demonstration
    const dates = generateDates(30);
    const prices = generatePriceData(30, 3.25, 4.50);
    
    // Chart gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(156, 79, 214, 0.5)');
    gradient.addColorStop(1, 'rgba(156, 79, 214, 0)');
    
    // Create the chart
    const eonicChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'EONIC Price',
                data: prices,
                borderColor: '#9C4FD6',
                borderWidth: 2,
                pointBackgroundColor: '#E056FD',
                pointBorderColor: '#E056FD',
                pointRadius: 0,
                pointHoverRadius: 5,
                tension: 0.4,
                fill: true,
                backgroundColor: gradient
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(42, 36, 56, 0.9)',
                    titleColor: '#FFFFFF',
                    bodyColor: '#E0E0E0',
                    borderColor: 'rgba(156, 79, 214, 0.5)',
                    borderWidth: 1,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `$${context.raw.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: 'rgba(224, 224, 224, 0.6)',
                        maxRotation: 0,
                        maxTicksLimit: 5
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: 'rgba(224, 224, 224, 0.6)',
                        callback: function(value) {
                            return '$' + value.toFixed(2);
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
    
    // Add event listeners to time control buttons
    document.querySelectorAll('.time-control').forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            document.querySelectorAll('.time-control').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update chart data based on selected time period
            let days;
            if (this.textContent === '1D') days = 1;
            else if (this.textContent === '1W') days = 7;
            else if (this.textContent === '1M') days = 30;
            
            // Generate new data
            const newDates = generateDates(days);
            const newPrices = generatePriceData(days, 3.25, 4.50);
            
            // Update chart
            eonicChart.data.labels = newDates;
            eonicChart.data.datasets[0].data = newPrices;
            eonicChart.update();
        });
    });
}

// Function to initialize interactive elements
function initInteractiveElements() {
    // Chat input functionality
    const chatInput = document.querySelector('.chat-input input');
    const chatSendButton = document.querySelector('.chat-input button');
    const chatMessages = document.querySelector('.chat-messages');
    
    // Function to send a message
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            // Create new message element
            const messageElement = document.createElement('div');
            messageElement.className = 'message sent';
            messageElement.innerHTML = `
                <span class="sender">You</span>
                <p>${message}</p>
            `;
            
            // Add to chat
            chatMessages.appendChild(messageElement);
            
            // Clear input
            chatInput.value = '';
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Simulate response after a delay
            setTimeout(() => {
                const responses = [
                    "Thanks for your message!",
                    "EONIC is looking strong today!",
                    "Have you checked the new staking rewards?",
                    "The community is growing fast!"
                ];
                
                const responseElement = document.createElement('div');
                responseElement.className = 'message received';
                responseElement.innerHTML = `
                    <span class="sender">EonicBot</span>
                    <p>${responses[Math.floor(Math.random() * responses.length)]}</p>
                `;
                
                chatMessages.appendChild(responseElement);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1000);
        }
    }
    
    // Add event listeners
    chatSendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Stake button functionality
    const stakeButton = document.querySelector('.stake-button');
    stakeButton.addEventListener('click', function() {
        alert('Staking functionality would be implemented here in a production environment.');
    });
    
    // Add hover effects to navigation items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// Helper function to generate dates for chart
function generateDates(days) {
    const dates = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        
        // Format date as MM/DD
        const month = date.getMonth() + 1;
        const day = date.getDate();
        dates.push(`${month}/${day}`);
    }
    
    return dates;
}

// Helper function to generate price data for chart
function generatePriceData(days, basePrice, maxPrice) {
    const prices = [];
    let price = basePrice;
    
    for (let i = 0; i < days; i++) {
        // Random price change between -5% and +5%
        const change = (Math.random() - 0.5) * 0.1;
        price = Math.max(0.1, Math.min(maxPrice, price * (1 + change)));
        prices.push(price);
    }
    
    return prices;
}

// Add 3D effect to background
function createBackgroundElements() {
    const container = document.querySelector('body');
    const elementsCount = 20;
    
    for (let i = 0; i < elementsCount; i++) {
        const element = document.createElement('div');
        element.className = 'bg-element';
        
        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        // Random size
        const size = Math.random() * 10 + 5;
        
        // Random opacity
        const opacity = Math.random() * 0.1 + 0.05;
        
        // Apply styles
        element.style.cssText = `
            position: absolute;
            top: ${posY}%;
            left: ${posX}%;
            width: ${size}px;
            height: ${size}px;
            background-color: rgba(156, 79, 214, ${opacity});
            border-radius: 50%;
            filter: blur(${size / 3}px);
            pointer-events: none;
            z-index: -1;
        `;
        
        container.appendChild(element);
    }
}

// Call background creation
createBackgroundElements();
