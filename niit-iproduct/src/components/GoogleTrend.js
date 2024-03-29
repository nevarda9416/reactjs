import React from "react";
import Script from "react-load-script";

export default function GoogleTrend({ type, keyword, url }) {
  const handleScriptLoad = _ => {
    window.trends.embed.renderExploreWidgetTo(
      document.getElementById("widget"),
      type,
      {
        comparisonItem: [{ keyword, geo: "VN", time: "today 12-m" }],
        category: 0,
        property: ""
      },
      {
        exploreQuery: `q=${encodeURI(keyword)}&geo=VN&date=today 12-m`,
        guestPath: "https://trends.google.com:443/trends/embed/"
      }
    );
  };
  const renderGoogleTrend = _ => {
    return <Script url={url} onLoad={handleScriptLoad} />;
  };
  return <div className="googleTrend">{renderGoogleTrend()}</div>;
}
