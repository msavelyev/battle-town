(ns tanks.client.gameloop)

(defn create-client [client-class client-instance]
  {:class client-class
   :instance client-instance})

(defn- get-ticks [client]
  (.getTicks (:class client) (:instance client)))

(defn- clear-ticks [client]
  (.clearTicks (:class client) (:instance client)))

(defn- send-net-messages [client net-messages]
  (doseq [net-message net-messages]
    (.sendNetMessage (:class client) (:instance client) net-message)))

(defn- wrap [fn]
  #js {:update fn})

(defn- create-keyboard-input [input]
  #js {:movingDirection (.-movingDirection input)
       :shooting (.-shooting input)})

(defn create-game-loop [game ctx input client]
  (wrap
   (fn [event]
     (do
       (let [keyboard-input (create-keyboard-input input)
             net-input (get-ticks client)
             match (.-match game)
             id (.-id game)
             game-loop-input #js {:event event
                                  :ctx ctx
                                  :id id
                                  :match match
                                  :input keyboard-input
                                  :networkInput net-input}]
         (let [game-loop-output (.update game game-loop-input)]
           (set! (.-match game) (:match game-loop-output))
           (.render game event)
           (clear-ticks client)
           (send-net-messages client (:net-messages game-loop-output))))))))

(defn create-result [match net-messages]
  {:match match
   :net-messages net-messages})
