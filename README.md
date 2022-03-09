# poc-mql2j

Proof of Concept on how to generate queries using the Java MongoDB Driver typesafe API instead of generating BSON documents manually.

It receives the MQL JSON through the standard input and will generate Java code in the standard output. The code can then be copied and pasted to be executed.

## Usage

Clone this repository into a folder in your system.

```bash
$> git clone git@github.com:kmruiz/poc-mql2j.git
```

Then enter into the cloned folder, and install all dependencies.

```bash
$> npm ci
```

---
ℹ **Using npm ci**

The difference between `npm i` and `npm ci` is that `npm ci` will avoid package resolution by just downloading the versions specified in the package-lock.json. It will be faster and more reliable, as you will be using the versions where the last commit was done.

---

To run the script, you can either copy the mql into a file and then pipe it to the script, or just using echo and piping.

```bash
$> echo '[ { $lookup: { from: "warehouses", let: { order_item: "$item", order_qty: "$ordered" }, pipeline: [ { $match: { $expr: { $and: [ { $eq: [ "$stock_item",  "$$order_item" ] }, { $gte: [ "$instock", "$$order_qty" ] } ] } } }, { $project: { stock_item: 0, _id: 0 } } ], as: "stockdata"}}, { "$skip": 5 }, { "$limit": 5 } ]' > my-mql.json
$> cat my-mql.json | npm run mql2j -- -I
```

The expected output would be (as in the current version). This is a PoC so not all queries and variations are supported, and I will be adding them when I have time:

```java
/** imports **/
import com.mongodb.client.model.Variable;
import static com.mongodb.client.model.Aggregates.limit;
import static com.mongodb.client.model.Aggregates.lookup;
import static com.mongodb.client.model.Aggregates.match;
import static com.mongodb.client.model.Aggregates.project;
import static com.mongodb.client.model.Aggregates.skip;
import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Projections.exclude;
import static java.util.Arrays.asList;

/** query **/
Arrays.asList(Aggregates.lookup("warehouses", Arrays.asList(new Variable("order_item", "$item"), new Variable("order_qty", "$ordered")), Arrays.asList(Aggregates.match(Filters.eq("$expr", Filters.eq("$and", Arrays.asList(Filters.eq("$eq", Arrays.asList("$stock_item", "$$order_item")), Filters.eq("$gte", Arrays.asList("$instock", "$$order_qty")))))), Projections.exclude("stock_item", "_id")), "stockdata")}, Aggregates.skip(5), Aggregates.limit(5));
```

You can use the --help flag to get more information on how to run different versions of the script. For example, if we want to use wildcard imports with static imports, so the code is more short, we can do:

```bash
$> cat my-mql.json | npm run mql2j -- -W -V 'static import'
```

With the expected following output:

```java
/** imports **/
import com.mongodb.client.model.Variable;
import static com.mongodb.client.model.Aggregates.*;
import static com.mongodb.client.model.Filters.*;
import static com.mongodb.client.model.Projections.*;
import static java.util.Arrays.*;

/** query **/
asList(lookup("warehouses", asList(new Variable("order_item", "$item"), new Variable("order_qty", "$ordered")), asList(match(eq("$expr", eq("$and", asList(eq("$eq", asList("$stock_item", "$$order_item")), eq("$gte", asList("$instock", "$$order_qty")))))), exclude("stock_item", "_id")), "stockdata")}, skip(5), limit(5));
```

Feel free to format the code to make it more readable using your IDE and your code style.

## How to collaborate

So this is a PoC, if it's useful for you, feel free to fork it, create a PR and I'll review and merge it. Feel free to add more aggregation stages or to improve how queries are generated.

Just give it a try with any cool idea you have.

If you have any issues or questions, feel free to create an issue to reach me out.