#pragma once

#include <cstddef>
#include <functional>
#include <memory>
#include <mutex>
#include <vector>
#include <optional>
#include <stdexcept>

namespace wss {

/// Generic thread-safe object pool.
/// Objects are pre-allocated and reused to avoid heap churn on the hot path.
template <typename T>
class ObjectPool {
public:
    using Factory = std::function<T()>;
    using Deleter = std::function<void(T&)>;

    explicit ObjectPool(size_t size, Factory factory, Deleter deleter = {})
        : deleter_(std::move(deleter)) {
        pool_.reserve(size);
        for (size_t i = 0; i < size; ++i) {
            pool_.push_back(factory());
        }
    }

    ~ObjectPool() {
        if (deleter_) {
            for (auto& obj : pool_) {
                deleter_(obj);
            }
        }
    }

    ObjectPool(const ObjectPool&) = delete;
    ObjectPool& operator=(const ObjectPool&) = delete;

    /// Checkout an object from the pool. Blocks if empty.
    /// Returns std::nullopt if pool is exhausted (non-blocking variant).
    [[nodiscard]] std::optional<T> try_checkout() {
        std::lock_guard lock(mutex_);
        if (pool_.empty()) {
            return std::nullopt;
        }
        T obj = std::move(pool_.back());
        pool_.pop_back();
        return obj;
    }

    /// Return an object to the pool.
    void checkin(T obj) {
        std::lock_guard lock(mutex_);
        pool_.push_back(std::move(obj));
    }

    [[nodiscard]] size_t available() const {
        std::lock_guard lock(mutex_);
        return pool_.size();
    }

private:
    std::vector<T> pool_;
    mutable std::mutex mutex_;
    Deleter deleter_;
};

} // namespace wss
