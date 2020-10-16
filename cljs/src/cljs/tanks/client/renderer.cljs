(ns tanks.client.renderer
  (:require [tanks.client.js :as tanks-js]))

(defn ui-bg-renderer [ctx size]
  (let [size (tanks-js/conv size)
        pixel-width (:pixelWidth size)
        pixel-height (:pixelHeight size)
        ui-x (:uiX size)
        ui-width (- pixel-width ui-x)]
    (fn []
      (set! (.-fillStyle ctx) "black")
      (.fillRect ctx ui-x 0 ui-width pixel-height))))
