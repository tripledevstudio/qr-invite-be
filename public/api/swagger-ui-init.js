/* swagger-ui-init.js: Initialize Swagger UI */
window.onload = function () {
  const ui = SwaggerUIBundle({
    url: "/api/swagger.json",   // Adjust the URL to point to your OpenAPI definition
    dom_id: "#swagger-ui",
    deepLinking: true,
    presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
    plugins: [SwaggerUIBundle.plugins.DownloadUrl],
    layout: "StandaloneLayout"
  });
  window.ui = ui;
};
