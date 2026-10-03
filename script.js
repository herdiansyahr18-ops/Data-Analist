/* =====================================================
   MARKETLENS
   Market Analyst: Herdiansyah Ramadhan
   Educational Market Simulation
===================================================== */


/* =========================
   MARKET DATA
========================= */

const assets = {

    ETH: {
        name: "Ethereum",
        symbol: "ETH / USD",
        price: 3420,
        support: 3200,
        resistance: 3500,
        rsi: 58.4
    },

    BTC: {
        name: "Bitcoin",
        symbol: "BTC / USD",
        price: 104500,
        support: 101000,
        resistance: 108000,
        rsi: 61.2
    },

    STOCK: {
        name: "Stock Demo",
        symbol: "STOCK / IDR",
        price: 8250,
        support: 7800,
        resistance: 8600,
        rsi: 54.7
    }

};


/* =========================
   DOM ELEMENTS
========================= */

const chartElement =
    document.getElementById("chart");

const currentPrice =
    document.getElementById("currentPrice");

const chartPrice =
    document.getElementById("chartPrice");

const chartAsset =
    document.getElementById("chartAsset");

const supportValue =
    document.getElementById("supportValue");

const resistanceValue =
    document.getElementById("resistanceValue");

const supportAnalysis =
    document.getElementById("supportAnalysis");

const resistanceAnalysis =
    document.getElementById("resistanceAnalysis");

const rsiValue =
    document.getElementById("rsiValue");

const rsiAnalysis =
    document.getElementById("rsiAnalysis");

const rsiBar =
    document.getElementById("rsiBar");


/* =========================
   FORMAT NUMBER
========================= */

function formatPrice(value, asset) {

    if (asset === "STOCK") {

        return "Rp " +
            value.toLocaleString("id-ID");

    }

    return "$" +
        value.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
}


/* =========================
   GENERATE CANDLE DATA
========================= */

function generateCandles(
    basePrice,
    support,
    resistance,
    count = 120
) {

    const candles = [];

    let previousClose = basePrice;

    const now =
        Math.floor(Date.now() / 1000);

    for (let i = 0; i < count; i++) {

        const time =
            now - (count - i) * 86400;

        const wave =
            Math.sin(i / 6) *
            (basePrice * 0.012);

        const trend =
            i * (basePrice * 0.00012);

        const noise =
            (Math.random() - 0.5) *
            basePrice *
            0.018;

        let close =
            basePrice +
            wave +
            trend +
            noise;

        /*
            Create simulated reaction
            around support/resistance.
        */

        if (i === 28 || i === 29) {
            close =
                support +
                Math.random() *
                (basePrice * 0.01);
        }

        if (i === 76 || i === 77) {
            close =
                resistance -
                Math.random() *
                (basePrice * 0.01);
        }

        const open =
            previousClose;

        const high =
            Math.max(open, close) +
            Math.random() *
            basePrice *
            0.006;

        const low =
            Math.min(open, close) -
            Math.random() *
            basePrice *
            0.006;

        candles.push({
            time,
            open,
            high,
            low,
            close
        });

        previousClose = close;
    }

    return candles;
}


/* =========================
   CREATE CHART
========================= */

const chart =
    LightweightCharts.createChart(
        chartElement,
        {

            layout: {
                background: {
                    color: "#080c12"
                },

                textColor: "#718095"
            },

            grid: {

                vertLines: {
                    color: "#111924"
                },

                horzLines: {
                    color: "#111924"
                }

            },

            crosshair: {

                vertLine: {
                    color: "#425064",
                    width: 1,
                    style: 2
                },

                horzLine: {
                    color: "#425064",
                    width: 1,
                    style: 2
                }

            },

            rightPriceScale: {

                borderColor: "#1b2633",

                scaleMargins: {
                    top: 0.08,
                    bottom: 0.08
                }

            },

            timeScale: {

                borderColor: "#1b2633",

                timeVisible: true,

                secondsVisible: false
            }

        }
    );


/* =========================
   CANDLESTICK SERIES
========================= */

const candleSeries =
    chart.addSeries(
        LightweightCharts.CandlestickSeries,
        {

            upColor: "#21d17b",

            downColor: "#ff5364",

            borderUpColor: "#21d17b",

            borderDownColor: "#ff5364",

            wickUpColor: "#21d17b",

            wickDownColor: "#ff5364"

        }
    );


/* =========================
   SUPPORT / RESISTANCE
========================= */

let supportSeries = null;
let resistanceSeries = null;


/* =========================
   UPDATE CHART
========================= */

function updateChart(assetKey) {

    const asset =
        assets[assetKey];

    const candles =
        generateCandles(
            asset.price,
            asset.support,
            asset.resistance
        );

    candleSeries.setData(candles);


    /* Remove old lines */

    if (supportSeries) {

        chart.removeSeries(
            supportSeries
        );

    }

    if (resistanceSeries) {

        chart.removeSeries(
            resistanceSeries
        );

    }


    /* SUPPORT LINE */

    supportSeries =
        chart.addSeries(
            LightweightCharts.LineSeries,
            {

                color: "#21d17b",

                lineWidth: 2,

                lineStyle: 2,

                priceLineVisible: false,

                lastValueVisible: true

            }
        );


    supportSeries.setData(

        candles.map(candle => ({

            time: candle.time,

            value: asset.support

        }))

    );


    /* RESISTANCE LINE */

    resistanceSeries =
        chart.addSeries(
            LightweightCharts.LineSeries,
            {

                color: "#ff5364",

                lineWidth: 2,

                lineStyle: 2,

                priceLineVisible: false,

                lastValueVisible: true

            }
        );


    resistanceSeries.setData(

        candles.map(candle => ({

            time: candle.time,

            value: asset.resistance

        }))

    );


    /* =========================
       PRICE LINES
    ========================= */

    candleSeries.createPriceLine({

        price: asset.support,

        color: "#21d17b",

        lineWidth: 1,

        lineStyle: 2,

        axisLabelVisible: true,

        title: "SUPPORT"

    });


    candleSeries.createPriceLine({

        price: asset.resistance,

        color: "#ff5364",

        lineWidth: 1,

        lineStyle: 2,

        axisLabelVisible: true,

        title: "RESISTANCE"

    });


    /* =========================
       UPDATE UI
    ========================= */

    const formattedPrice =
        formatPrice(
            asset.price,
            assetKey
        );

    const formattedSupport =
        formatPrice(
            asset.support,
            assetKey
        );

    const formattedResistance =
        formatPrice(
            asset.resistance,
            assetKey
        );


    currentPrice.textContent =
        formattedPrice;

    chartPrice.textContent =
        formattedPrice;

    chartAsset.textContent =
        asset.symbol;


    supportValue.textContent =
        formattedSupport;

    resistanceValue.textContent =
        formattedResistance;

    supportAnalysis.textContent =
        formattedSupport;

    resistanceAnalysis.textContent =
        formattedResistance;


    rsiValue.textContent =
        asset.rsi;

    rsiAnalysis.textContent =
        asset.rsi;

    rsiBar.style.width =
        `${asset.rsi}%`;


    chart.timeScale().fitContent();

}


/* =========================
   ASSET SWITCHER
========================= */

const assetButtons =
    document.querySelectorAll(
        ".asset-button"
    );


assetButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            assetButtons.forEach(btn => {

                btn.classList.remove(
                    "active"
                );

            });

            button.classList.add(
                "active"
            );

            const asset =
                button.dataset.asset;

            updateChart(asset);

        }
    );

});


/* =========================
   THEME
========================= */

const themeButton =
    document.getElementById(
        "themeButton"
    );


themeButton.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "light"
        );

        themeButton.textContent =
            document.body.classList.contains(
                "light"
            )
                ? "☀"
                : "☾";

    }
);


/* =========================
   COPY SOLIDITY
========================= */

const copyButton =
    document.getElementById(
        "copyCode"
    );

const solidityCode =
    document.getElementById(
        "solidityCode"
    );


copyButton.addEventListener(
    "click",
    async () => {

        try {

            await navigator.clipboard.writeText(
                solidityCode.textContent
            );

            copyButton.textContent =
                "Copied ✓";

            setTimeout(() => {

                copyButton.textContent =
                    "Copy Code";

            }, 1500);

        } catch (error) {

            copyButton.textContent =
                "Copy failed";

        }

    }
);


/* =========================
   TIMEFRAME BUTTON
========================= */

const timeButtons =
    document.querySelectorAll(
        ".time-button"
    );


timeButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            timeButtons.forEach(btn => {

                btn.classList.remove(
                    "active"
                );

            });

            button.classList.add(
                "active"
            );

        }
    );

});


/* =========================
   RESIZE CHART
========================= */

window.addEventListener(
    "resize",
    () => {

        chart.applyOptions({

            width:
                chartElement.clientWidth,

            height:
                chartElement.clientHeight

        });

    }
);


/* =========================
   INITIALIZE
========================= */

updateChart("ETH");


console.log(
    "===================================="
);

console.log(
    "MarketLens initialized"
);

console.log(
    "Market Analyst: Herdiansyah Ramadhan"
);

console.log(
    "Educational simulation mode"
);

console.log(
    "===================================="
);