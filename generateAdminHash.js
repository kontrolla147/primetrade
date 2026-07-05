const bcrypt = require("bcrypt");

(async () => {

    const password = "bigbro08156";

    const hash = await bcrypt.hash(password, 12);

    console.log("\nYour Admin Password Hash:\n");

    console.log(hash);

})();