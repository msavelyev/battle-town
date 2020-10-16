(ns tanks.lib.data)

(defn create-modify-result [obj success]
  {:success success
   :result obj})

(defn modified-successfully [obj]
  (create-modify-result obj true))

(defn modified-unsuccessfully [obj]
  (create-modify-result obj false))

(defn get-result [result]
  (:result result))

(defn successful? [result]
  (:success result))

(defn is-successful [result]
  (successful? result))
