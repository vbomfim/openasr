add_executable(openasr_tests
    test_audio_ring_buffer.cpp
    test_buffer_engine.cpp
    test_audio_utils.cpp
    test_messages.cpp
    test_validator.cpp
    test_object_pool.cpp
    test_result_aggregator.cpp
    test_resampler.cpp
    test_audio_pipeline.cpp
    test_session_manager.cpp
    test_session.cpp
    test_config.cpp
    test_connection.cpp
    test_json_formatter.cpp
    test_vad.cpp
    test_auth_rate_limiter.cpp
    test_session_id.cpp
    test_ip_extraction.cpp
    test_rate_limiter_capacity.cpp
    test_constant_time.cpp
)

target_include_directories(openasr_tests PRIVATE
    ${CMAKE_SOURCE_DIR}/include
    ${CMAKE_SOURCE_DIR}/src
)

# Mark third-party headers as SYSTEM
get_target_property(_spdlog_inc spdlog::spdlog INTERFACE_INCLUDE_DIRECTORIES)
if(_spdlog_inc)
    target_include_directories(openasr_tests SYSTEM PRIVATE ${_spdlog_inc})
endif()
get_target_property(_json_inc nlohmann_json::nlohmann_json INTERFACE_INCLUDE_DIRECTORIES)
if(_json_inc)
    target_include_directories(openasr_tests SYSTEM PRIVATE ${_json_inc})
endif()
get_target_property(_toml_inc tomlplusplus::tomlplusplus INTERFACE_INCLUDE_DIRECTORIES)
if(_toml_inc)
    target_include_directories(openasr_tests SYSTEM PRIVATE ${_toml_inc})
endif()
get_target_property(_whisper_inc whisper INTERFACE_INCLUDE_DIRECTORIES)
if(_whisper_inc)
    target_include_directories(openasr_tests SYSTEM PRIVATE ${_whisper_inc})
endif()

target_link_libraries(openasr_tests PRIVATE
    GTest::gtest_main
    nlohmann_json::nlohmann_json
    spdlog::spdlog
    tomlplusplus::tomlplusplus
    whisper
)

# Link opus and samplerate for audio tests
if(OPUS_FOUND AND TARGET PkgConfig::OPUS)
    target_link_libraries(openasr_tests PRIVATE PkgConfig::OPUS)
else()
    target_link_libraries(openasr_tests PRIVATE opus)
endif()
if(SAMPLERATE_FOUND AND TARGET PkgConfig::SAMPLERATE)
    target_link_libraries(openasr_tests PRIVATE PkgConfig::SAMPLERATE)
else()
    target_link_libraries(openasr_tests PRIVATE samplerate)
endif()

include(GoogleTest)
gtest_discover_tests(openasr_tests)
