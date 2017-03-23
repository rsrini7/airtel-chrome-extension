var xhr = new XMLHttpRequest();
xhr.open("GET", "http://122.160.230.125:8080/gbod/gb_on_demand.do", true);
xhr.onreadystatechange = function() {
    if (xhr.readyState != 4) return;

    document.body.classList.remove("loading");

    if (xhr.status != 200) {
        document.body.classList.add("error");
        return;
    }

    var div = document.createElement("div");
    div.innerHTML = xhr.responseText;

    /*var ul = div.querySelector("#container .content ul");
    var items = Array.prototype.slice.apply(ul.getElementsByTagName("li"));

    items = items.map(function(item) {
        return item.innerText.split(":")[1].trim();
    });*/

    var usageTotal, usageActual, daysLeft;

    usageActual = $(div).find('.DatablockSectionSecond h3').text();
    usageActual = usageActual.substr(0, usageActual.indexOf('GB'));

    usageTotal = $(div).find('.DatablockSectionSecond h3 span').text();
    usageTotal = usageTotal.replace(/of /, '').replace(' GB', '');

    daysLeft = $(div).find('.DatablockSectionThird p').text();

    var remaining = parseFloat(usageActual),
        total = parseFloat(usageTotal),
        remainingDays = daysLeft,
        dsl = $(div).find('.dslblock').text();

    var template = document.querySelector("#detailsTemplate").content.cloneNode(true);
    template.querySelector("meter").setAttribute("max", total);
    template.querySelector("meter").setAttribute("value", total - remaining);
    template.querySelector("meter").setAttribute("high", 0.8 * total);
    template.querySelector(".percentage").innerText = template.querySelector(".percentage").innerText.replace("${used}", ((total - remaining) * 100 / total).toFixed(2));
    var gist = template.querySelector(".gist").innerHTML;
    gist = gist.replace("${remaining}", remaining);
    gist = gist.replace("${days}", remainingDays);
    template.querySelector(".gist").innerHTML = gist;
    template.querySelector("footer").innerHTML = template.querySelector("footer").innerHTML.replace("${dslNumber}", dsl);

    document.querySelector("#details").appendChild(template);

    document.body.classList.add("details");
};

xhr.send();