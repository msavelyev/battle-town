(ns tanks.client.js)

(defn conv [obj]
  (js->clj obj :keywordize-keys true))
