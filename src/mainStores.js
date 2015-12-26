import ItemsStore from "items-store/ItemsStore";

import desc from "./mainStoresDescriptions";

module.exports = {
	Router: new ItemsStore(desc.Router)
};
