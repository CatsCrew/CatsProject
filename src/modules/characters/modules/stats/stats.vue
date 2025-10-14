<style lang="scss" scoped src="./stats.scss"></style>

<template>
    <section class="stats-container">
        <div class="header">
            C.A.T.S Data Archive
        </div>
        <div class="stats-content">
            <Terminal
                v-if="!showStats"
                welcomeMessage="Welcome to the C.A.T.S Data Archive. Please login..."
                prompt="~">
            </Terminal>
            <template v-else>
                <div class="timeline-container">
                    <div> Historical Timeline </div>
                    <Timeline
                        :value="events"
                        layout="horizontal"
                        align="top">
                        <template #opposite="slotProps">
                            <span class="date"> {{ slotProps.item.date }} </span>
                        </template>
                        <template #content="slotProps">
                            {{ slotProps.item.label }}
                        </template>
                    </Timeline>
                </div>
                <div class="composition-container">
                    <Card>
                        <template #content>
                            <div class="composition-header cats-count">
                                0
                            </div>
                            <div class="composition-item">
                                Active Units
                            </div>
                        </template>
                    </Card>
                    <Card>
                        <template #content>
                            <div class="composition-header aerocats-count">
                                0
                            </div>
                            <div class="composition-item">
                                Aerocats
                            </div>
                        </template>
                    </Card>
                    <Card>
                        <template #content>
                            <div class="composition-header landcats-count">
                                0
                            </div>
                            <div class="composition-item">
                                Landcats
                            </div>
                        </template>
                    </Card>
                    <Card>
                        <template #content>
                            <div class="composition-header protos-count">
                                0
                            </div>
                            <div class="composition-item">
                                Protos
                            </div>
                        </template>
                    </Card>
                </div>
                <div class="ownership-charts">
                    <div class="section-header">
                        C.A.T.S Composition
                    </div>
                    <div class="cats-ownership-charts"> 
                        <Card>
                            <template #content>
                                <Chart 
                                    type="venn"
                                    :data="loadCompositionVenndiagramData()">
                                </Chart>
                            </template>
                        </Card>
                        <Card>
                            <template #content>
                                <Chart
                                    type="bar"
                                    :data="loadCatsPerPersonData()">
                                </Chart>
                            </template>
                        </Card>
                    </div>
                </div>
                <div class="fill-rate-charts">
                    <div class="section-header">
                        C.A.T.S Optional Data Fill Rate
                    </div>
                    <div class="fill-rate-charts-content">
                        <Card>
                            <template #content>
                                <Chart type="bar" :data="loadAerocatOptionalFieldFillRate()">
                                </Chart>
                            </template>
                        </Card>
                        <Card>
                            <template #content>
                                <Chart type="bar" :data="loadLandcatOptionalFieldFillRate()">
                                </Chart>
                            </template>
                        </Card>
                        <Card>
                            <template #content>
                                <Chart type="bar" :data="loadProtoOptionalFieldFillRate()">
                                </Chart>
                            </template>
                        </Card>
                    </div>
                </div>
            </template>
        </div>
    </section>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, nextTick } from 'vue';
import Terminal from 'primevue/terminal';
import TerminalService from 'primevue/terminalservice';
import Card from '@/components/card/card.vue';
import Chart from 'primevue/chart';
import Timeline from 'primevue/timeline';
import { useCatsStore } from '@/store';
import { storeToRefs } from 'pinia';
import { gsap } from 'gsap';
import { extractSets } from 'chartjs-chart-venn';

const cats$ = useCatsStore();
const { cats, aerocats, landcats, protos } = $(storeToRefs(cats$));

let loggedIn = $ref(true);
let showStats = $ref(false);

const commandHandler = (text: string) => {
    let response = "";
    let argsIndex = text.indexOf(' ');
    let command = argsIndex !== -1 ? text.substring(0, argsIndex) : text;

    switch (command) {
        case 'login':
            if (text.substring(argsIndex + 1).trim().toLowerCase() === 'dr.presto') {
                response = 'Welcome Dr. Presto...';
                loggedIn = true;
            } else {
                response = 'Login denied...';
            }
            
            break;
        case 'stats':
            if (!loggedIn) {
                response = 'You must login to see stats!';
                break;
            }
            response = 'Showing all data for C.A.T.S...';
            showStats = true;
            nextTick(() => {
                loadStats();
            }) 
            break;
        default:
            response = "Unknown command: " + command;
    }
    
    TerminalService.emit('response', response);
};

// { label: '', date: ''},
const events = [
    // January 2025
    { label: 'Discord server officially opened, species semi-open launch, WIX site activated', date: '01/10/2025'},
    { label: 'AEROCATS & LANDCATS registration system', date: '01/14/2025'},
    { label: 'Proto 1.0 Type P revealed', date: '01/23/2025'},

    // March 2025
    { label: 'LANDCATS management transferred to Presto; 2nd revision sheets for AEROCATS & LANDCATS released', date: '03/15/2025'},
    { label: 'Official CATS Bluesky news channel opened', date: '03/19/2025'},

    // June 2025

    { label: 'Lore released along with Welcome and Advanced Guides', date: '06/15/25'},
    { label: 'PROTO 2.0 and industrial models revealed', date: '06/16/2025'},
    { label: 'Lore short story collection released', date: '06/26/2025'},

    // August 2025
    { label: 'New website officially launched', date: '08/18/2025'},
];

function loadStats() {
    gsap.to('.cats-count', {
        innerText: cats?.length,
        duration: 2,
        ease: 'power1.out',
        snap: {
            innerText: 1
        }
    });

    gsap.to('.aerocats-count', {
        innerText: aerocats?.length,
        duration: 2,
        ease: 'power1.out',
        snap: {
            innerText: 1
        }
    });

    gsap.to('.landcats-count', {
        innerText: landcats?.length,
        duration: 2,
        ease: 'power1.out',
        snap: {
            innerText: 1
        }
    });

    gsap.to('.protos-count', {
        innerText: protos?.length,
        duration: 2,
        ease: 'power1.out',
        snap: {
            innerText: 1
        }
    });
}

function loadCompositionVenndiagramData() {
    const aerocatCreators = new Set(aerocats.map(a => a.creator.name));
    const landcatCreators = new Set(landcats.map(a => a.creator.name));
    const protosCreators = new Set(protos.map(a => a.creator.name));

    return extractSets(
        [
            { label: 'Aerocat', values: [...aerocatCreators] },
            { label: 'Landcat', values: [...landcatCreators] },
            { label: 'Proto', values: [...protosCreators] },
        ],
        {
            label: 'Ownership Overlap of CAT Types',
        }
    );
}

function loadCatsPerPersonData() {
    // Count cats per person
    const ownerCounts: Record<string, number> = {};
    cats.forEach(cat => {
        const ownerName = cat.creator.name;
        ownerCounts[ownerName] = (ownerCounts[ownerName] || 0) + 1;
    });

    // Count occurrences of each cat count
    const countOccurrences: Record<number, number> = {};
    Object.values(ownerCounts).forEach(count => {
        countOccurrences[count] = (countOccurrences[count] || 0) + 1;
    });

    // Prepare chart data: x = number of cats, y = number of people with that count
    const sortedCounts = Object.keys(countOccurrences).map(Number).sort((a, b) => a - b);

    return {
        labels: sortedCounts,
        datasets: [
            {
                label: 'C.A.T.S per Person',
                data: sortedCounts.map(count => countOccurrences[count]),
                backgroundColor: 'rgba(139, 92, 246, 0.5)'
            }
        ]
    };
}

function loadAerocatOptionalFieldFillRate() {
    const fields = [
        'copilot',
        'faction',
        'description',
        'weight',
        'height',
        'equipment'
    ];

    const fillRates = fields.map(field => {
        const filled = aerocats.filter(a => a[field] !== undefined && a[field] !== null && a[field] !== '').length;
        return (filled / aerocats.length) * 100;
    });

    return {
        labels: fields,
        datasets: [
            {
                label: 'Aerocat Field Fill Rate (%)',
                data: fillRates,
                backgroundColor: '#00aaff'
            }
        ]
    };
}

function loadLandcatOptionalFieldFillRate() {
    const fields = [
        'crewmate',
        'faction',
        'description',
        'weight',
        'height',
        'equipment'
    ];

    const fillRates = fields.map(field => {
        const filled = landcats.filter(a => a[field] !== undefined && a[field] !== null && a[field] !== '').length;
        return (filled / landcats.length) * 100;
    });

    return {
        labels: fields,
        datasets: [
            {
                label: 'Landcat Field Fill Rate (%)',
                data: fillRates,
                backgroundColor: '#00ff88'
            }
        ]
    };
}

function loadProtoOptionalFieldFillRate() {
    const fields = [
        'faction',
        'description',
        'weight',
        'height',
        'equipment'
    ];

    const fillRates = fields.map(field => {
        const filled = protos.filter(a => a[field] !== undefined && a[field] !== null && a[field] !== '').length;
        return (filled / protos.length) * 100;
    });

    return {
        labels: fields,
        datasets: [
            {
                label: 'Proto Field Fill Rate (%)',
                data: fillRates,
                backgroundColor: '#c0c0c0'
            }
        ]
    };
}

onMounted(() => {
    TerminalService.on('command', commandHandler);
});

onBeforeUnmount(() => {
    TerminalService.off('command', commandHandler);
});

</script>