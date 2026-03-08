window.BENCHMARK_DATA = {
  "lastUpdate": 1772989641482,
  "repoUrl": "https://github.com/vbomfim/openasr",
  "entries": {
    "Benchmark": [
      {
        "commit": {
          "author": {
            "email": "vbomfim@gmail.com",
            "name": "Vinicius Bomfim",
            "username": "vbomfim"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "be1b3ab8d2b9b52ba4807987e7892e3c3e15d370",
          "message": "feat: add Google Benchmark integration + ring buffer benchmarks + CI workflow (#89) (#90)\n\n* feat: add Google Benchmark integration + ring buffer benchmarks + CI workflow (#89)\n\nPR 1/4 of benchmark suite. Adds:\n- BUILD_BENCHMARKS CMake option with Google Benchmark v1.9.1\n- benchmarks/bench_ring_buffer.cpp with 4 parameterized benchmarks\n- benchmarks/helpers/synthetic_audio.hpp for test data generation\n- .github/workflows/benchmark.yml with regression detection\n\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>\n\n* fix: address code review findings on benchmark PR (#89)\n\n- Add ClobberMemory() to BM_RingBuffer_ExtractWindow (prevent loop hoisting)\n- Fix inflated SetBytesProcessed in WriteWrapAround (use min of chunk/capacity)\n- Remove Arg(48000) from WriteWrapAround (tests truncation, not wrap-around)\n- Add SYSTEM include dirs for benchmark::benchmark headers\n\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>\n\n* fix: handle missing gh-pages branch on first benchmark run (#89)\n\nThe benchmark-action fails with 'fatal: couldn't find remote ref gh-pages'\non the first run before any baseline exists. Add a check step that detects\nwhether gh-pages exists and skips fetch/comparison on first run.\n\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>\n\n* ci: re-trigger after gh-pages branch creation\n\n---------\n\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>",
          "timestamp": "2026-03-08T12:30:00-04:00",
          "tree_id": "ff5d00324dd7b1a3b506a932f2d14ea747369b21",
          "url": "https://github.com/vbomfim/openasr/commit/be1b3ab8d2b9b52ba4807987e7892e3c3e15d370"
        },
        "date": 1772987543612,
        "tool": "googlecpp",
        "benches": [
          {
            "name": "BM_RingBuffer_Write/64",
            "value": 10.686941102124607,
            "unit": "ns/iter",
            "extra": "iterations: 65542721\ncpu: 10.686613407459847 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/64",
            "value": 11.011227348953097,
            "unit": "ns/iter",
            "extra": "iterations: 65542721\ncpu: 11.01109760151703 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/64",
            "value": 8.996051048902624,
            "unit": "ns/iter",
            "extra": "iterations: 65542721\ncpu: 8.995408612956421 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/64_mean",
            "value": 10.231406499993442,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 10.231039873977766 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/64_median",
            "value": 10.686941102124607,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 10.686613407459847 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/64_stddev",
            "value": 1.0820664075625814,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1.082317401670218 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/64_cv",
            "value": 0.10575930176982755,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.1057876242299718 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256",
            "value": 38.80495880453133,
            "unit": "ns/iter",
            "extra": "iterations: 18047495\ncpu: 38.803900818368426 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256",
            "value": 38.76806354566129,
            "unit": "ns/iter",
            "extra": "iterations: 18047495\ncpu: 38.76599550242291 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256",
            "value": 36.701549993503846,
            "unit": "ns/iter",
            "extra": "iterations: 18047495\ncpu: 36.69887150543606 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256_mean",
            "value": 38.09152411456549,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 38.08958927540913 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256_median",
            "value": 38.76806354566129,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 38.76599550242291 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256_stddev",
            "value": 1.2038942469949574,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1.2045460306827545 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256_cv",
            "value": 0.031605305247804735,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.03162402256357268 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024",
            "value": 132.0257116027321,
            "unit": "ns/iter",
            "extra": "iterations: 5307526\ncpu: 132.02151058704175 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024",
            "value": 131.9913771501083,
            "unit": "ns/iter",
            "extra": "iterations: 5307526\ncpu: 131.9803275575097 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024",
            "value": 130.65981589162317,
            "unit": "ns/iter",
            "extra": "iterations: 5307526\ncpu: 130.6540985385659 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024_mean",
            "value": 131.5589682148212,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 131.55197889437244 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024_median",
            "value": 131.9913771501083,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 131.9803275575097 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024_stddev",
            "value": 0.778877967907894,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.7778597948828673 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024_cv",
            "value": 0.005920371514590117,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.0059129463609774915 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096",
            "value": 501.6105608074663,
            "unit": "ns/iter",
            "extra": "iterations: 1393776\ncpu: 501.614181905844 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096",
            "value": 502.2809655210014,
            "unit": "ns/iter",
            "extra": "iterations: 1393776\ncpu: 502.2524229144426 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096",
            "value": 501.72671074835966,
            "unit": "ns/iter",
            "extra": "iterations: 1393776\ncpu: 501.69638736784054 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096_mean",
            "value": 501.8727456922757,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 501.85433072937576 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096_median",
            "value": 501.72671074835966,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 501.69638736784054 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096_stddev",
            "value": 0.3582670424466809,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.34719947487884145 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096_cv",
            "value": 0.0007138603271881056,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.0006918331747266883 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000",
            "value": 2297.2495818086713,
            "unit": "ns/iter",
            "extra": "iterations: 306080\ncpu: 2297.0577986147396 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000",
            "value": 2294.4377188970248,
            "unit": "ns/iter",
            "extra": "iterations: 306080\ncpu: 2294.278972817567 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000",
            "value": 2296.864453737563,
            "unit": "ns/iter",
            "extra": "iterations: 306080\ncpu: 2296.8498823836876 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000_mean",
            "value": 2296.1839181477526,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2296.0622179386646 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000_median",
            "value": 2296.864453737563,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2296.8498823836876 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000_stddev",
            "value": 1.5244637668593448,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1.5478306307540375 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000_cv",
            "value": 0.0006639118734395953,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.0006741239930961596 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000",
            "value": 7060.81286065927,
            "unit": "ns/iter",
            "extra": "iterations: 99124\ncpu: 7060.103597514212 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000",
            "value": 7049.7942778739725,
            "unit": "ns/iter",
            "extra": "iterations: 99124\ncpu: 7049.352164965099 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000",
            "value": 6954.025745530759,
            "unit": "ns/iter",
            "extra": "iterations: 99124\ncpu: 6953.882894152785 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000_mean",
            "value": 7021.544294688002,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7021.112885544032 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000_median",
            "value": 7049.794277873972,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7049.352164965098 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000_stddev",
            "value": 58.73174739333149,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 58.47052361932512 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000_cv",
            "value": 0.008364505716750051,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.008327814204456352 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256",
            "value": 8.60191132976526,
            "unit": "ns/iter",
            "extra": "iterations: 80655679\ncpu: 8.601357283223669 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256",
            "value": 8.554826759315995,
            "unit": "ns/iter",
            "extra": "iterations: 80655679\ncpu: 8.553998472940778 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256",
            "value": 8.512434220533862,
            "unit": "ns/iter",
            "extra": "iterations: 80655679\ncpu: 8.512320205003782 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256_mean",
            "value": 8.556390769871705,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 8.555891987056075 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256_median",
            "value": 8.554826759315995,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 8.553998472940778 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256_stddev",
            "value": 0.04475905345157391,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.044548730299271345 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256_cv",
            "value": 0.0052310670065674235,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.005206789703127113 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024",
            "value": 31.06530257048821,
            "unit": "ns/iter",
            "extra": "iterations: 22448075\ncpu: 31.062409048437285 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024",
            "value": 31.060115087819078,
            "unit": "ns/iter",
            "extra": "iterations: 22448075\ncpu: 31.059254345862524 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024",
            "value": 27.329389223797172,
            "unit": "ns/iter",
            "extra": "iterations: 22448075\ncpu: 27.327078067941258 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024_mean",
            "value": 29.818268960701488,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 29.816247154080358 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024_median",
            "value": 31.060115087819085,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 31.059254345862524 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024_stddev",
            "value": 2.1554346397127833,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2.1556842399989797 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024_cv",
            "value": 0.07228570654297552,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.07229897944094464 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096",
            "value": 79.64808634274377,
            "unit": "ns/iter",
            "extra": "iterations: 8790733\ncpu: 79.63874548345383 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096",
            "value": 79.6110835126037,
            "unit": "ns/iter",
            "extra": "iterations: 8790733\ncpu: 79.60885753213056 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096",
            "value": 84.95562178944368,
            "unit": "ns/iter",
            "extra": "iterations: 8790733\ncpu: 84.94968349055766 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096_mean",
            "value": 81.4049305482637,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 81.39909550204735 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096_median",
            "value": 79.64808634274375,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 79.63874548345383 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096_stddev",
            "value": 3.0750444744758654,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3.074935709982024 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096_cv",
            "value": 0.037774671064337066,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.037776042731392304 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000",
            "value": 1396.2843787166553,
            "unit": "ns/iter",
            "extra": "iterations: 501124\ncpu: 1396.2096087994178 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000",
            "value": 1397.3493027673578,
            "unit": "ns/iter",
            "extra": "iterations: 501124\ncpu: 1397.1847027881322 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000",
            "value": 1318.9109422019142,
            "unit": "ns/iter",
            "extra": "iterations: 501124\ncpu: 1318.8048067943269 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000_mean",
            "value": 1370.848207895309,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1370.7330394606254 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000_median",
            "value": 1396.2843787166555,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1396.2096087994178 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000_stddev",
            "value": 44.98214303018469,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 44.97381141237718 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000_cv",
            "value": 0.032813365309968694,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.032810044055021886 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000",
            "value": 1429.2488066288438,
            "unit": "ns/iter",
            "extra": "iterations: 488532\ncpu: 1429.2106781132031 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000",
            "value": 1429.3333988357035,
            "unit": "ns/iter",
            "extra": "iterations: 488532\ncpu: 1429.1796381813244 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000",
            "value": 1427.1368508101655,
            "unit": "ns/iter",
            "extra": "iterations: 488532\ncpu: 1427.0166519286358 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000_mean",
            "value": 1428.5730187582376,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1428.4689894077212 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000_median",
            "value": 1429.2488066288436,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1429.1796381813247 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000_stddev",
            "value": 1.2444768947501024,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1.2578569013317151 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000_cv",
            "value": 0.0008711328566402872,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.0008805629738264418 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio",
            "value": 0.1442693699046815,
            "unit": "ns/iter",
            "extra": "iterations: 4859110811\ncpu: 0.14425981280631492 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio",
            "value": 0.14416201692997524,
            "unit": "ns/iter",
            "extra": "iterations: 4859110811\ncpu: 0.14415375368973044 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio",
            "value": 0.144064468835594,
            "unit": "ns/iter",
            "extra": "iterations: 4859110811\ncpu: 0.14405370575526075 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio_mean",
            "value": 0.14416528522341693,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.14415575741710202 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio_median",
            "value": 0.14416201692997524,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.1441537536897304 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio_stddev",
            "value": 0.00010248962549138053,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.00010306813437329185 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio_cv",
            "value": 0.00071091750925023,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.0007149775785581236 ns\nthreads: 1"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "vbomfim@gmail.com",
            "name": "Vinicius Bomfim",
            "username": "vbomfim"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "6ee75a01f996cac48d935b8b878bfe5b425d40e3",
          "message": "feat: add audio pipeline and buffer engine benchmarks (#89) (#91)\n\n* ci: re-trigger after gh-pages branch creation\n\n* feat: add audio pipeline and buffer engine benchmarks (#89)\n\nPR 2/4 of benchmark suite. Adds:\n- benchmarks/bench_audio_pipeline.cpp: PCM conversion, resampling, pipeline ingest\n- benchmarks/bench_buffer_engine.cpp: windowing, VAD processing\n\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>\n\n* fix: address review comments on audio benchmark PR (#89)\n\n- Use wss::kWhisperSampleRate constant instead of magic 16000\n- Fix unused stride_data in buffer engine benchmark (simulate streaming)\n- Fix implementation-defined signed right-shift in PCM byte generation\n\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>\n\n* fix: address code review findings on audio benchmarks (#89)\n\n- Rename BM_BufferEngine_ExtractVADWindow → BM_BufferEngine_VADFullCycle\n  (honestly describes the end-to-end scenario being measured)\n- Add ClobberMemory() to BM_VAD_Process and BM_VAD_IsSpeechFrame\n  (prevent optimizer from caching VAD internal state)\n\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>\n\n---------\n\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>",
          "timestamp": "2026-03-08T12:30:51-04:00",
          "tree_id": "123a834bf94c02666d150ad9fa23d58168b0e884",
          "url": "https://github.com/vbomfim/openasr/commit/6ee75a01f996cac48d935b8b878bfe5b425d40e3"
        },
        "date": 1772987671181,
        "tool": "googlecpp",
        "benches": [
          {
            "name": "BM_RingBuffer_Write/64",
            "value": 6.027821117264198,
            "unit": "ns/iter",
            "extra": "iterations: 116479614\ncpu: 6.027556409999779 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/64",
            "value": 6.031764631362746,
            "unit": "ns/iter",
            "extra": "iterations: 116479614\ncpu: 6.030969728316579 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/64",
            "value": 5.319012449680493,
            "unit": "ns/iter",
            "extra": "iterations: 116479614\ncpu: 5.318547715997755 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/64_mean",
            "value": 5.792866066102477,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 5.792357951438038 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/64_median",
            "value": 6.027821117264199,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 6.027556409999779 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/64_stddev",
            "value": 0.4103740064538839,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.41033524963311047 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/64_cv",
            "value": 0.07084127300218927,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.07084079628249472 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256",
            "value": 20.206236676102,
            "unit": "ns/iter",
            "extra": "iterations: 34566650\ncpu: 20.204936174029015 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256",
            "value": 20.23507065336067,
            "unit": "ns/iter",
            "extra": "iterations: 34566650\ncpu: 20.232750295443726 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256",
            "value": 22.66711063987981,
            "unit": "ns/iter",
            "extra": "iterations: 34566650\ncpu: 22.664019741571718 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256_mean",
            "value": 21.036139323114156,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 21.033902070348155 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256_median",
            "value": 20.23507065336067,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 20.23275029544373 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256_stddev",
            "value": 1.4125361682609847,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1.411791812861936 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256_cv",
            "value": 0.06714807059244533,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.06711982437401202 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024",
            "value": 74.09564290651356,
            "unit": "ns/iter",
            "extra": "iterations: 9411205\ncpu: 74.0902874817836 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024",
            "value": 74.0246066258252,
            "unit": "ns/iter",
            "extra": "iterations: 9411205\ncpu: 74.00815634129741 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024",
            "value": 82.60749850842535,
            "unit": "ns/iter",
            "extra": "iterations: 9411205\ncpu: 82.59733307265118 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024_mean",
            "value": 76.90924934692138,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 76.89859229857738 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024_median",
            "value": 74.09564290651358,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 74.09028748178362 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024_stddev",
            "value": 4.93495634917164,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4.9354251274461065 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024_cv",
            "value": 0.06416596691655503,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.06418095546252815 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096",
            "value": 304.6192638635564,
            "unit": "ns/iter",
            "extra": "iterations: 2344348\ncpu: 304.5774983065656 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096",
            "value": 299.14356571635,
            "unit": "ns/iter",
            "extra": "iterations: 2344348\ncpu: 299.1170901248445 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096",
            "value": 318.06801464630104,
            "unit": "ns/iter",
            "extra": "iterations: 2344348\ncpu: 318.0385936729532 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096_mean",
            "value": 307.27694807540246,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 307.2443940347877 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096_median",
            "value": 304.6192638635564,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 304.5774983065656 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096_stddev",
            "value": 9.738128970855117,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 9.738586845594034 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096_cv",
            "value": 0.03169170037599268,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.031696548528372434 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000",
            "value": 1469.641697222583,
            "unit": "ns/iter",
            "extra": "iterations: 476449\ncpu: 1469.4852355656117 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000",
            "value": 1473.64758242752,
            "unit": "ns/iter",
            "extra": "iterations: 476449\ncpu: 1473.599186901429 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000",
            "value": 1555.0420002980322,
            "unit": "ns/iter",
            "extra": "iterations: 476449\ncpu: 1554.861766946727 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000_mean",
            "value": 1499.4437599827118,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1499.3153964712558 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000_median",
            "value": 1473.64758242752,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1473.599186901429 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000_stddev",
            "value": 48.19113013500114,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 48.14852649507346 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000_cv",
            "value": 0.03213933821402996,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.03211367441993486 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000",
            "value": 4514.058651970316,
            "unit": "ns/iter",
            "extra": "iterations: 155323\ncpu: 4513.976597155605 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000",
            "value": 4508.084295307231,
            "unit": "ns/iter",
            "extra": "iterations: 155323\ncpu: 4507.591322598717 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000",
            "value": 4758.09480244385,
            "unit": "ns/iter",
            "extra": "iterations: 155323\ncpu: 4757.631484068685 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000_mean",
            "value": 4593.412583240465,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4593.066467941002 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000_median",
            "value": 4514.058651970315,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4513.976597155605 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000_stddev",
            "value": 142.65026542458952,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 142.5532403441556 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000_cv",
            "value": 0.031055400062485916,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.031036616025297784 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256",
            "value": 10.910256882161539,
            "unit": "ns/iter",
            "extra": "iterations: 64169812\ncpu: 10.909300638125597 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256",
            "value": 10.904885290921628,
            "unit": "ns/iter",
            "extra": "iterations: 64169812\ncpu: 10.904188499102968 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256",
            "value": 10.901820641145296,
            "unit": "ns/iter",
            "extra": "iterations: 64169812\ncpu: 10.90094884491791 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256_mean",
            "value": 10.905654271409489,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 10.904812660715493 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256_median",
            "value": 10.904885290921628,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 10.90418849910297 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256_stddev",
            "value": 0.0042703675305649615,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.004210735771767392 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256_cv",
            "value": 0.00039157371252454375,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.0003861355442571276 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024",
            "value": 67.4359663648598,
            "unit": "ns/iter",
            "extra": "iterations: 10348819\ncpu: 67.43023711207991 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024",
            "value": 67.50938836595516,
            "unit": "ns/iter",
            "extra": "iterations: 10348819\ncpu: 67.50151442401281 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024",
            "value": 54.28063936570928,
            "unit": "ns/iter",
            "extra": "iterations: 10348819\ncpu: 54.27745581404014 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024_mean",
            "value": 63.07533136550807,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 63.06973578337761 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024_median",
            "value": 67.4359663648598,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 67.43023711207991 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024_stddev",
            "value": 7.6165151628586685,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7.614421212949069 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024_cv",
            "value": 0.12075267775800638,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.12073019045302379 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096",
            "value": 249.25127741760656,
            "unit": "ns/iter",
            "extra": "iterations: 2813293\ncpu: 249.22781487744044 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096",
            "value": 249.31142970177925,
            "unit": "ns/iter",
            "extra": "iterations: 2813293\ncpu: 249.2854771970069 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096",
            "value": 177.47169491410676,
            "unit": "ns/iter",
            "extra": "iterations: 2813293\ncpu: 177.46603855339657 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096_mean",
            "value": 225.34480067783088,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 225.32644354261467 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096_median",
            "value": 249.25127741760662,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 249.22781487744047 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096_stddev",
            "value": 41.459336658621005,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 41.44833658344743 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096_cv",
            "value": 0.18398177607787033,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.18394794650725735 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000",
            "value": 1383.6408719647422,
            "unit": "ns/iter",
            "extra": "iterations: 505892\ncpu: 1383.5414396748708 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000",
            "value": 1382.1479683410635,
            "unit": "ns/iter",
            "extra": "iterations: 505892\ncpu: 1382.022178646827 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000",
            "value": 1290.231717441638,
            "unit": "ns/iter",
            "extra": "iterations: 505892\ncpu: 1290.114044104278 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000_mean",
            "value": 1352.0068525824809,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1351.892554141992 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000_median",
            "value": 1382.1479683410635,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1382.0221786468271 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000_stddev",
            "value": 53.50404360008768,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 53.50715153489037 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000_cv",
            "value": 0.03957379616670515,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.03957944096293203 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000",
            "value": 1399.607624973715,
            "unit": "ns/iter",
            "extra": "iterations: 499805\ncpu: 1399.4778803733475 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000",
            "value": 1399.6750172567015,
            "unit": "ns/iter",
            "extra": "iterations: 499805\ncpu: 1399.6127269635151 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000",
            "value": 1402.2772561299075,
            "unit": "ns/iter",
            "extra": "iterations: 499805\ncpu: 1402.1955942817685 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000_mean",
            "value": 1400.519966120108,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1400.4287338728773 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000_median",
            "value": 1399.6750172567017,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1399.6127269635151 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000_stddev",
            "value": 1.5222307852389043,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1.5316307256183475 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000_cv",
            "value": 0.0010869040228365858,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.0010936870178196302 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio",
            "value": 0.155596893827944,
            "unit": "ns/iter",
            "extra": "iterations: 4491085926\ncpu: 0.15558046840184175 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio",
            "value": 0.15551146771801908,
            "unit": "ns/iter",
            "extra": "iterations: 4491085926\ncpu: 0.15550110563616046 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio",
            "value": 0.15568238295158646,
            "unit": "ns/iter",
            "extra": "iterations: 4491085926\ncpu: 0.15566849321510817 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio_mean",
            "value": 0.1555969148325165,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.1555833557510368 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio_median",
            "value": 0.15559689382794398,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.15558046840184173 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio_stddev",
            "value": 0.00008545761876988473,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.0000837311351058542 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio_cv",
            "value": 0.0005492243780146332,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.0005381754025143929 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/1600",
            "value": 324.96549771422565,
            "unit": "ns/iter",
            "extra": "iterations: 2157915\ncpu: 324.94401401352764 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/1600",
            "value": 324.5850897741572,
            "unit": "ns/iter",
            "extra": "iterations: 2157915\ncpu: 324.5618344559454 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/1600",
            "value": 324.559102652329,
            "unit": "ns/iter",
            "extra": "iterations: 2157915\ncpu: 324.5371958580392 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/1600_mean",
            "value": 324.7032300469039,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 324.68101477583735 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/1600_median",
            "value": 324.5850897741572,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 324.5618344559454 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/1600_stddev",
            "value": 0.22750182328842283,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.22809694080143686 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/1600_cv",
            "value": 0.0007006453962763469,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.0007025262655376294 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/8000",
            "value": 1652.113509828152,
            "unit": "ns/iter",
            "extra": "iterations: 423884\ncpu: 1652.066039293772 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/8000",
            "value": 1651.7841956761843,
            "unit": "ns/iter",
            "extra": "iterations: 423884\ncpu: 1651.69272017817 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/8000",
            "value": 1647.4910801068256,
            "unit": "ns/iter",
            "extra": "iterations: 423884\ncpu: 1647.4324508592028 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/8000_mean",
            "value": 1650.462928537054,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1650.3970701103817 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/8000_median",
            "value": 1651.7841956761843,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1651.6927201781702 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/8000_stddev",
            "value": 2.5789579818270845,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2.5742119706026028 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/8000_cv",
            "value": 0.0015625664395340494,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.0015597531147037449 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/16000",
            "value": 3278.3736951396004,
            "unit": "ns/iter",
            "extra": "iterations: 213337\ncpu: 3278.236138128871 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/16000",
            "value": 3278.990587661744,
            "unit": "ns/iter",
            "extra": "iterations: 213337\ncpu: 3278.7371154558246 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/16000",
            "value": 3279.118512025587,
            "unit": "ns/iter",
            "extra": "iterations: 213337\ncpu: 3279.0026062052034 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/16000_mean",
            "value": 3278.8275982756436,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3278.658619929967 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/16000_median",
            "value": 3278.9905876617445,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3278.7371154558246 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/16000_stddev",
            "value": 0.3982614761834184,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.3892165047742675 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/16000_cv",
            "value": 0.00012146459801450573,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.0001187121167200327 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/1600",
            "value": 152.41143007083366,
            "unit": "ns/iter",
            "extra": "iterations: 4599919\ncpu: 152.40252469663182 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/1600",
            "value": 152.27948774749922,
            "unit": "ns/iter",
            "extra": "iterations: 4599919\ncpu: 152.27465527110382 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/1600",
            "value": 152.3902531761965,
            "unit": "ns/iter",
            "extra": "iterations: 4599919\ncpu: 152.38668398291261 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/1600_mean",
            "value": 152.36039033150976,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 152.3546213168827 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/1600_median",
            "value": 152.3902531761965,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 152.38668398291261 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/1600_stddev",
            "value": 0.0708592710298642,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.06970407747524868 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/1600_cv",
            "value": 0.00046507672286535045,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.0004575120654218358 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/8000",
            "value": 792.1061503184615,
            "unit": "ns/iter",
            "extra": "iterations: 883125\ncpu: 792.0383184713394 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/8000",
            "value": 791.949543949067,
            "unit": "ns/iter",
            "extra": "iterations: 883125\ncpu: 791.9213214437331 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/8000",
            "value": 793.4304736022906,
            "unit": "ns/iter",
            "extra": "iterations: 883125\ncpu: 793.4013814578833 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/8000_mean",
            "value": 792.4953892899397,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 792.4536737909852 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/8000_median",
            "value": 792.1061503184615,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 792.0383184713393 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/8000_stddev",
            "value": 0.8135836724569754,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.822821027069459 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/8000_cv",
            "value": 0.0010266099758459548,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.0010383206669144465 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/16000",
            "value": 1578.8445831915694,
            "unit": "ns/iter",
            "extra": "iterations: 443813\ncpu: 1578.7291697178694 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/16000",
            "value": 1577.946605890322,
            "unit": "ns/iter",
            "extra": "iterations: 443813\ncpu: 1577.883031817457 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/16000",
            "value": 1580.121134351635,
            "unit": "ns/iter",
            "extra": "iterations: 443813\ncpu: 1580.0232552899604 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/16000_mean",
            "value": 1578.9707744778418,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1578.8784856084287 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/16000_median",
            "value": 1578.8445831915697,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1578.7291697178696 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/16000_stddev",
            "value": 1.0927427362728068,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1.0778963560553776 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/16000_cv",
            "value": 0.0006920601406534403,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.0006826974753791802 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/4800",
            "value": 756844.6836402924,
            "unit": "ns/iter",
            "extra": "iterations: 923\ncpu: 756808.3791982733 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/4800",
            "value": 757552.1050920676,
            "unit": "ns/iter",
            "extra": "iterations: 923\ncpu: 757542.1213434464 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/4800",
            "value": 757023.5005417156,
            "unit": "ns/iter",
            "extra": "iterations: 923\ncpu: 756962.2199349934 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/4800_mean",
            "value": 757140.0964246918,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 757104.2401589043 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/4800_median",
            "value": 757023.5005417158,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 756962.2199349934 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/4800_stddev",
            "value": 367.84130758737683,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 386.93887347379615 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/4800_cv",
            "value": 0.00048582991354488873,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.0005110774090930777 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/16000",
            "value": 2571304.044117644,
            "unit": "ns/iter",
            "extra": "iterations: 272\ncpu: 2571183.7830882478 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/16000",
            "value": 2571904.2058824264,
            "unit": "ns/iter",
            "extra": "iterations: 272\ncpu: 2571749.1397058996 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/16000",
            "value": 2572792.551470575,
            "unit": "ns/iter",
            "extra": "iterations: 272\ncpu: 2572650.198529428 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/16000_mean",
            "value": 2572000.2671568817,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2571861.040441192 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/16000_median",
            "value": 2571904.2058824264,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2571749.1397058996 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/16000_stddev",
            "value": 748.8887524587348,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 739.584270594893 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/16000_cv",
            "value": 0.0002911697801985708,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.00028756774140021983 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/48000",
            "value": 7751283.822222237,
            "unit": "ns/iter",
            "extra": "iterations: 90\ncpu: 7750977.411111156 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/48000",
            "value": 7751473.844444629,
            "unit": "ns/iter",
            "extra": "iterations: 90\ncpu: 7750946.711111103 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/48000",
            "value": 7764893.933333243,
            "unit": "ns/iter",
            "extra": "iterations: 90\ncpu: 7764751.577777753 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/48000_mean",
            "value": 7755883.8666667035,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7755558.56666667 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/48000_median",
            "value": 7751473.84444463,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7750977.411111156 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/48000_stddev",
            "value": 7803.525044770995,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7961.395957715413 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/48000_cv",
            "value": 0.0010061425852840634,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.0010265406275098523 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/3200",
            "value": 805.9778291535389,
            "unit": "ns/iter",
            "extra": "iterations: 868979\ncpu: 805.9395957784938 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/3200",
            "value": 806.3032558899528,
            "unit": "ns/iter",
            "extra": "iterations: 868979\ncpu: 806.2012338618036 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/3200",
            "value": 862.699265459803,
            "unit": "ns/iter",
            "extra": "iterations: 868979\ncpu: 862.6837023679569 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/3200_mean",
            "value": 824.9934501677648,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 824.9415106694181 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/3200_median",
            "value": 806.3032558899528,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 806.2012338618036 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/3200_stddev",
            "value": 32.654599304972045,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 32.6859585950695 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/3200_cv",
            "value": 0.039581646737112446,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.03962215281001646 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/8000",
            "value": 2299.731618673884,
            "unit": "ns/iter",
            "extra": "iterations: 304317\ncpu: 2299.574509475317 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/8000",
            "value": 2298.888550426075,
            "unit": "ns/iter",
            "extra": "iterations: 304317\ncpu: 2298.7979146745124 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/8000",
            "value": 2370.0443386337374,
            "unit": "ns/iter",
            "extra": "iterations: 304317\ncpu: 2369.946805469304 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/8000_mean",
            "value": 2322.8881692445652,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2322.7730765397105 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/8000_median",
            "value": 2299.731618673884,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2299.574509475317 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/8000_stddev",
            "value": 40.840616114523264,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 40.855492907497414 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/8000_cv",
            "value": 0.01758182621757688,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.017589102146973734 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/16000",
            "value": 4719.9783859241525,
            "unit": "ns/iter",
            "extra": "iterations: 148283\ncpu: 4719.703641010786 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/16000",
            "value": 4719.27643087892,
            "unit": "ns/iter",
            "extra": "iterations: 148283\ncpu: 4719.1626282176485 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/16000",
            "value": 4619.177350067144,
            "unit": "ns/iter",
            "extra": "iterations: 148283\ncpu: 4618.790447994729 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/16000_mean",
            "value": 4686.144055623406,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4685.88557240772 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/16000_median",
            "value": 4719.27643087892,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4719.1626282176485 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/16000_stddev",
            "value": 57.995930245276895,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 58.10671186453944 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/16000_cv",
            "value": 0.012376045114464926,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.012400369357436703 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/9600",
            "value": 1536345.5428571142,
            "unit": "ns/iter",
            "extra": "iterations: 455\ncpu: 1536304.0835164913 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/9600",
            "value": 1536015.1912088045,
            "unit": "ns/iter",
            "extra": "iterations: 455\ncpu: 1535956.6703296748 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/9600",
            "value": 1535748.318681309,
            "unit": "ns/iter",
            "extra": "iterations: 455\ncpu: 1535580.2197802234 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/9600_mean",
            "value": 1536036.3509157423,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1535946.9912087966 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/9600_median",
            "value": 1536015.1912088047,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1535956.670329675 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/9600_stddev",
            "value": 299.17382760473396,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 362.0289236162716 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/9600_cv",
            "value": 0.0001947700179272286,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.00023570404817900212 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/24000",
            "value": 3867843.1049723104,
            "unit": "ns/iter",
            "extra": "iterations: 181\ncpu: 3867608.0994475144 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/24000",
            "value": 3868994.2651933944,
            "unit": "ns/iter",
            "extra": "iterations: 181\ncpu: 3868669.9889502823 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/24000",
            "value": 3872824.629834169,
            "unit": "ns/iter",
            "extra": "iterations: 181\ncpu: 3872562.7569060926 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/24000_mean",
            "value": 3869887.333333291,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3869613.615101296 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/24000_median",
            "value": 3868994.265193395,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3868669.9889502823 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/24000_stddev",
            "value": 2608.0788931784828,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2608.6357297830004 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/24000_cv",
            "value": 0.0006739418149757963,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.0006741333862385414 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/48000",
            "value": 7763463.044444544,
            "unit": "ns/iter",
            "extra": "iterations: 90\ncpu: 7763157.822222173 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/48000",
            "value": 7761523.866666822,
            "unit": "ns/iter",
            "extra": "iterations: 90\ncpu: 7760841.73333334 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/48000",
            "value": 7760885.4666667385,
            "unit": "ns/iter",
            "extra": "iterations: 90\ncpu: 7760741.100000009 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/48000_mean",
            "value": 7761957.4592593685,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7761580.218518507 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/48000_median",
            "value": 7761523.866666823,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7760841.733333339 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/48000_stddev",
            "value": 1342.3780019057622,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1367.1711106378516 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/48000_cv",
            "value": 0.0001729432310021768,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.00017614597442101946 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_WindowReady",
            "value": 0.15560029880266743,
            "unit": "ns/iter",
            "extra": "iterations: 4490673433\ncpu: 0.15558994489902764 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_WindowReady",
            "value": 0.15553678872912072,
            "unit": "ns/iter",
            "extra": "iterations: 4490673433\ncpu: 0.15552042815401193 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_WindowReady",
            "value": 0.15581447358387815,
            "unit": "ns/iter",
            "extra": "iterations: 4490673433\ncpu: 0.15580504203633114 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_WindowReady_mean",
            "value": 0.15565052037188873,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.1556384716964569 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_WindowReady_median",
            "value": 0.15560029880266743,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.15558994489902764 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_WindowReady_stddev",
            "value": 0.00014549527194999504,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.00014838262382892975 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_WindowReady_cv",
            "value": 0.0009347560907754743,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.0009533801136156213 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/5000",
            "value": 16098.097873218965,
            "unit": "ns/iter",
            "extra": "iterations: 43587\ncpu: 16096.09693257167 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/5000",
            "value": 16047.20317984718,
            "unit": "ns/iter",
            "extra": "iterations: 43587\ncpu: 16046.715373849884 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/5000",
            "value": 15829.29146305065,
            "unit": "ns/iter",
            "extra": "iterations: 43587\ncpu: 15829.094821850404 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/5000_mean",
            "value": 15991.530838705597,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 15990.635709423985 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/5000_median",
            "value": 16047.20317984718,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 16046.715373849884 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/5000_stddev",
            "value": 142.78928080606383,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 142.0606502661515 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/5000_cv",
            "value": 0.008929056401558466,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.008883990158216719 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/10000",
            "value": 33347.28060738803,
            "unit": "ns/iter",
            "extra": "iterations: 21008\ncpu: 33346.29931454668 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/10000",
            "value": 33317.2630426502,
            "unit": "ns/iter",
            "extra": "iterations: 21008\ncpu: 33314.551218583045 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/10000",
            "value": 33368.43354912423,
            "unit": "ns/iter",
            "extra": "iterations: 21008\ncpu: 33365.85034272669 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/10000_mean",
            "value": 33344.32573305416,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 33342.233625285466 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/10000_median",
            "value": 33347.28060738803,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 33346.29931454668 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/10000_stddev",
            "value": 25.712908140600586,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 25.89010248219248 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/10000_cv",
            "value": 0.0007711329461705515,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.0007764957433013253 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/20000",
            "value": 67399.37278163638,
            "unit": "ns/iter",
            "extra": "iterations: 10368\ncpu: 67393.96778549299 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/20000",
            "value": 67426.4229359586,
            "unit": "ns/iter",
            "extra": "iterations: 10368\ncpu: 67425.5161072532 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/20000",
            "value": 67184.43393132706,
            "unit": "ns/iter",
            "extra": "iterations: 10368\ncpu: 67180.38667052484 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/20000_mean",
            "value": 67336.74321630732,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 67333.290187757 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/20000_median",
            "value": 67399.37278163637,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 67393.96778549299 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/20000_stddev",
            "value": 132.59531074760307,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 133.35455874633485 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/20000_cv",
            "value": 0.0019691375676079877,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.0019805145177738885 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_VADFullCycle",
            "value": 24408.40341701529,
            "unit": "ns/iter",
            "extra": "iterations: 28680\ncpu: 24406.882461645586 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_VADFullCycle",
            "value": 24401.76021617943,
            "unit": "ns/iter",
            "extra": "iterations: 28680\ncpu: 24400.126220362738 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_VADFullCycle",
            "value": 24539.13668061359,
            "unit": "ns/iter",
            "extra": "iterations: 28680\ncpu: 24538.116178521333 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_VADFullCycle_mean",
            "value": 24449.766771269427,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 24448.374953509887 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_VADFullCycle_median",
            "value": 24408.403417015288,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 24406.882461645582 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_VADFullCycle_stddev",
            "value": 77.46785495683005,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 77.79156316091644 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_VADFullCycle_cv",
            "value": 0.003168449649501827,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.003181870505047553 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/480",
            "value": 406.7946377515596,
            "unit": "ns/iter",
            "extra": "iterations: 1720808\ncpu: 406.75998368208883 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/480",
            "value": 406.77815537817213,
            "unit": "ns/iter",
            "extra": "iterations: 1720808\ncpu: 406.7589149980714 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/480",
            "value": 406.82041227143213,
            "unit": "ns/iter",
            "extra": "iterations: 1720808\ncpu: 406.80327322978115 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/480_mean",
            "value": 406.79773513372123,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.7740573033138 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/480_median",
            "value": 406.7946377515596,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.7599836820887 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/480_stddev",
            "value": 0.02129804220840693,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.025307376682975845 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/480_cv",
            "value": 0.00005235536083160813,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.00006221482473771731 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/1600",
            "value": 1326.5131243937738,
            "unit": "ns/iter",
            "extra": "iterations: 527872\ncpu: 1326.4064299678746 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/1600",
            "value": 1326.2887082474224,
            "unit": "ns/iter",
            "extra": "iterations: 527872\ncpu: 1326.2317361026976 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/1600",
            "value": 1326.287834929677,
            "unit": "ns/iter",
            "extra": "iterations: 527872\ncpu: 1326.2247173557334 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/1600_mean",
            "value": 1326.3632225236245,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1326.2876278087685 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/1600_median",
            "value": 1326.2887082474224,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1326.2317361026978 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/1600_stddev",
            "value": 0.12981956171334558,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.10294552139664415 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/1600_cv",
            "value": 0.00009787632792346464,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.00007761930311204515 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/16000",
            "value": 13520.273068078312,
            "unit": "ns/iter",
            "extra": "iterations: 51749\ncpu: 13518.807706429014 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/16000",
            "value": 13515.310653345887,
            "unit": "ns/iter",
            "extra": "iterations: 51749\ncpu: 13514.352393282898 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/16000",
            "value": 13516.451931437907,
            "unit": "ns/iter",
            "extra": "iterations: 51749\ncpu: 13515.86308914187 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/16000_mean",
            "value": 13517.3452176207,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 13516.34106295126 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/16000_median",
            "value": 13516.451931437907,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 13515.863089141872 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/16000_stddev",
            "value": 2.5990113842248164,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2.2657886122241444 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/16000_cv",
            "value": 0.00019227232436416905,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.00016763328194157118 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_IsSpeechFrame/480",
            "value": 406.3557460243284,
            "unit": "ns/iter",
            "extra": "iterations: 1722417\ncpu: 406.342596479257 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_IsSpeechFrame/480",
            "value": 406.29149445228614,
            "unit": "ns/iter",
            "extra": "iterations: 1722417\ncpu: 406.2816205367215 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_IsSpeechFrame/480",
            "value": 406.39013374809394,
            "unit": "ns/iter",
            "extra": "iterations: 1722417\ncpu: 406.34944963966825 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_IsSpeechFrame/480_mean",
            "value": 406.34579140823615,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.32455555188227 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_IsSpeechFrame/480_median",
            "value": 406.3557460243284,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.342596479257 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_IsSpeechFrame/480_stddev",
            "value": 0.05006743960307456,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.03734036806318137 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_IsSpeechFrame/480_cv",
            "value": 0.0001232138751322127,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.00009189788693047251 ns\nthreads: 1"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "vbomfim@gmail.com",
            "name": "Vinicius Bomfim",
            "username": "vbomfim"
          },
          "committer": {
            "email": "vbomfim@gmail.com",
            "name": "Vinicius Bomfim",
            "username": "vbomfim"
          },
          "distinct": true,
          "id": "46cc2017796eae51b35d7bcf1bc15dfb58f30552",
          "message": "fix: filter stddev/cv aggregates from benchmark CI to prevent false positives\n\nThe _stddev and _cv statistical aggregates cause false positive regression\nalerts on shared CI runners — their ratios can be 40-50x between runs due\nto scheduling jitter, even when actual benchmark times are stable. Filter\nthem from the JSON output before comparison. Only mean/median values are\nused for regression detection.\n\nAlso adds --benchmark_report_aggregates_only=true to reduce output noise.\n\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>",
          "timestamp": "2026-03-08T13:04:01-04:00",
          "tree_id": "8c8951c5d91aae4a45e46cd93c75cf23b1fe2111",
          "url": "https://github.com/vbomfim/openasr/commit/46cc2017796eae51b35d7bcf1bc15dfb58f30552"
        },
        "date": 1772989640949,
        "tool": "googlecpp",
        "benches": [
          {
            "name": "BM_RingBuffer_Write/64_mean",
            "value": 5.815412074132581,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 5.814921321235979 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/64_median",
            "value": 6.023128452202768,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 6.022441672642366 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256_mean",
            "value": 21.213047002454733,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 21.21168143160863 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256_median",
            "value": 20.44671005622447,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 20.445075069805075 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024_mean",
            "value": 81.9605712459471,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 81.9554274384066 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024_median",
            "value": 80.3393243593793,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 80.3325157520083 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096_mean",
            "value": 322.4679285651867,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 322.4460641969154 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096_median",
            "value": 320.2861503835372,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 320.26264448153375 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000_mean",
            "value": 1505.1026637272887,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1504.9731424155143 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000_median",
            "value": 1479.210512868143,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1479.0302720600027 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000_mean",
            "value": 4750.9030861591755,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4750.599096232892 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000_median",
            "value": 4696.5479333693775,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4696.1860536768 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256_mean",
            "value": 10.896404158484467,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 10.895791046332631 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256_median",
            "value": 10.896842475014582,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 10.895884790570705 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024_mean",
            "value": 63.02761254006188,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 63.02480174762844 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024_median",
            "value": 67.39702043681304,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 67.39342691155231 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096_mean",
            "value": 224.8505637022108,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 224.83839726966167 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096_median",
            "value": 248.69612116765657,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 248.6837053355633 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000_mean",
            "value": 1351.9141224717775,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1351.8123046157098 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000_median",
            "value": 1383.9244566785221,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1383.8133598390662 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000_mean",
            "value": 1408.3148729802072,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1408.2432342463514 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000_median",
            "value": 1406.5199871946568,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1406.473932284746 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio_mean",
            "value": 0.15566847761191147,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.15566034786524763 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio_median",
            "value": 0.15566750131561577,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.15565987610487678 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/1600_mean",
            "value": 324.63516580162826,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 324.6243377414126 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/1600_median",
            "value": 324.6447594639175,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 324.63925125861846 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/8000_mean",
            "value": 1649.9028126763149,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1649.806760700162 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/8000_median",
            "value": 1649.9934731264802,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1649.8328234090632 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/16000_mean",
            "value": 3280.156847309158,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3280.020240075601 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/16000_median",
            "value": 3280.4932546098357,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3280.374606967967 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/1600_mean",
            "value": 152.29199258983454,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 152.28640619482042 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/1600_median",
            "value": 152.26545348133655,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 152.2594682133998 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/8000_mean",
            "value": 798.0797930345269,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 798.0377599012327 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/8000_median",
            "value": 798.4818431242502,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 798.4287295419437 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/16000_mean",
            "value": 1583.7798826319056,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1583.6964908999578 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/16000_median",
            "value": 1582.984571496844,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1582.8957184607943 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/4800_mean",
            "value": 767331.5176684983,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 767287.3992714057 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/4800_median",
            "value": 763416.2480874326,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 763366.8939890768 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/16000_mean",
            "value": 2600372.1913580364,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2600285.6444444573 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/16000_median",
            "value": 2590830.3185184845,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2590785.7481481633 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/48000_mean",
            "value": 7845180.220973848,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7844731.224719115 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/48000_median",
            "value": 7832472.303370811,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7831833.6179775195 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/3200_mean",
            "value": 825.8925297779191,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 825.8476848932293 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/3200_median",
            "value": 807.1301456406615,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 807.0863464167473 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/8000_mean",
            "value": 2339.4535143569624,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2339.3099483639894 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/8000_median",
            "value": 2319.5055702111104,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2319.359967868 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/16000_mean",
            "value": 4686.5425529288605,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4686.352913583422 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/16000_median",
            "value": 4714.887453961407,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4714.650753785795 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/9600_mean",
            "value": 1541241.9933920924,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1541176.3325991177 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/9600_median",
            "value": 1541302.3193832962,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1541238.6453744445 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/24000_mean",
            "value": 3886064.162962975,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3885916.5222222167 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/24000_median",
            "value": 3884794.8277776823,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3884684.333333313 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/48000_mean",
            "value": 7803317.159259341,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7802852.470370371 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/48000_median",
            "value": 7802253.688889019,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7801761.133333369 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_WindowReady_mean",
            "value": 0.15564855997155283,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.15563836503099182 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_WindowReady_median",
            "value": 0.1556563775703492,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.15564522773442974 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/5000_mean",
            "value": 19361.82620167897,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 19360.53129439971 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/5000_median",
            "value": 19364.86177691657,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 19363.866565180928 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/10000_mean",
            "value": 41956.41106316611,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 41953.202804746514 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/10000_median",
            "value": 41956.87726237479,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 41952.930121059595 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/20000_mean",
            "value": 85351.73167239434,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 85344.67337587998 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/20000_median",
            "value": 85337.22324496848,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 85334.0478645072 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_VADFullCycle_mean",
            "value": 24404.48950464717,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 24402.727654587652 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_VADFullCycle_median",
            "value": 24366.222543251697,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 24363.775402931216 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/480_mean",
            "value": 406.732270922975,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.7043243134356 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/480_median",
            "value": 406.73407343029925,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.70257525390485 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/1600_mean",
            "value": 1326.4211490751675,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1326.3325112032592 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/1600_median",
            "value": 1326.485327630206,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1326.3636675336363 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/16000_mean",
            "value": 13512.50146763475,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 13511.678999948468 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/16000_median",
            "value": 13512.282712806833,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 13511.33010196186 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_IsSpeechFrame/480_mean",
            "value": 406.2811531320738,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.23844094711677 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_IsSpeechFrame/480_median",
            "value": 406.2313373715654,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.1954192297405 ns\nthreads: 1"
          }
        ]
      }
    ]
  }
}