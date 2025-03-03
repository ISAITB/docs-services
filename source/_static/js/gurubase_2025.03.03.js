document.addEventListener('DOMContentLoaded', function() {
    // Customize widget settings
    const widgetSettings = {
        widgetId: "bIRIZqmxAK8HjGX-C0sOzXk8a7m3BpL86V6dI4w4oD4",
        text: "Ask AI",
        margins: { bottom: "20px", right: "34px" }, // Optional
        lightMode: true, // Optional - Force light mode
        bgColor: "#3b81bb", // Optional - Widget background color
        name: "ITB" // Optional - Widget name
    };

    // Load the GuruBase widget
    const guruScript = document.createElement("script");
    guruScript.src = "https://widget.gurubase.io/widget.latest.min.js";
    guruScript.defer = true;
    guruScript.id = "guru-widget-id";

    // Add widget settings as data attributes
    Object.entries({
        "data-widget-id": widgetSettings.widgetId,
        "data-text": widgetSettings.text,
        "data-margins": JSON.stringify(widgetSettings.margins),
        "data-light-mode": widgetSettings.lightMode,
        "data-bg-color": widgetSettings.bgColor,
        "data-icon-url": widgetSettings.iconUrl,
        "data-name": widgetSettings.name
    }).forEach(([key, value]) => {
        guruScript.setAttribute(key, value);
    });

    // Append the script to the document
    document.body.appendChild(guruScript);
});