# transformer.py — Multi-Head Attention Transformer Signal
# Upgraded from single-head to 4-head attention
# Based on Vaswani et al. (2017) "Attention Is All You Need"

import numpy as np


# ── Utility Functions ─────────────────────────────────────

def positional_encoding(seq_len, d_model):
    """Add positional information to input sequence"""
    PE  = np.zeros((seq_len, d_model))
    pos = np.arange(seq_len)[:, np.newaxis]
    dim = np.arange(d_model)[np.newaxis, :]
    ang = pos / np.power(10000, (2 * (dim // 2)) / d_model)
    PE[:, 0::2] = np.sin(ang[:, 0::2])
    PE[:, 1::2] = np.cos(ang[:, 1::2])
    return PE


def softmax(x):
    """Numerically stable softmax"""
    x = x - x.max(axis=-1, keepdims=True)
    e = np.exp(x)
    return e / (e.sum(axis=-1, keepdims=True) + 1e-9)


def sigmoid(x):
    """Sigmoid activation clipped for stability"""
    return 1 / (1 + np.exp(-np.clip(x, -10, 10)))


def layer_norm(x, eps=1e-6):
    """Layer normalization for stable training"""
    mean = x.mean(axis=-1, keepdims=True)
    std  = x.std(axis=-1,  keepdims=True)
    return (x - mean) / (std + eps)


# ── Single Attention Head ─────────────────────────────────

def single_head_attention(x, W_Q, W_K, W_V):
    """
    Scaled dot-product attention for one head
    x: (seq_len, d_model)
    Returns: (seq_len, d_head)
    """
    Q      = x @ W_Q
    K      = x @ W_K
    V      = x @ W_V
    scale  = np.sqrt(Q.shape[-1])
    scores = Q @ K.T / scale
    attn   = softmax(scores)
    return attn @ V


# ── Multi-Head Attention ──────────────────────────────────

def multi_head_attention(x, W_Qs, W_Ks, W_Vs, W_O):
    """
    Multi-head attention with num_heads heads
    Each head learns different market patterns:
      Head 1 → RSI / momentum patterns
      Head 2 → MA crossover / trend patterns
      Head 3 → Volatility / risk patterns
      Head 4 → MACD / divergence patterns

    x:    (seq_len, n_features)
    W_Qs: list of (n_features, d_head) matrices
    W_Ks: list of (n_features, d_head) matrices
    W_Vs: list of (n_features, d_head) matrices
    W_O:  (num_heads * d_head, d_model) output projection
    Returns: (seq_len, d_model)
    """
    heads = []
    for W_Q, W_K, W_V in zip(W_Qs, W_Ks, W_Vs):
        head = single_head_attention(x, W_Q, W_K, W_V)
        heads.append(head)

    # Concatenate all heads
    concat = np.concatenate(heads, axis=-1)  # (seq_len, num_heads*d_head)

    # Final linear projection
    output = concat @ W_O                    # (seq_len, d_model)

    return output


# ── Transformer Training ──────────────────────────────────

def train(train_data, close_idx, n_features,
          seq_len=60, d_model=32, num_heads=4,
          lr=0.05, epochs=10):
    """
    Train multi-head Transformer encoder

    Parameters:
        train_data: scaled training data (n_samples, n_features)
        close_idx:  index of Close price in features
        n_features: number of input features (20)
        seq_len:    lookback window (default 60)
        d_model:    model dimension (default 32, upgrade from 16)
        num_heads:  number of attention heads (default 4)
        lr:         learning rate
        epochs:     training epochs

    Returns:
        trained weights
    """
    np.random.seed(42)

    # Each head works on d_head dimensions
    assert d_model % num_heads == 0
    d_head = d_model // num_heads  # 32 // 4 = 8

    # Initialize weights for each head
    sc = np.sqrt(2.0 / n_features)
    W_Qs  = [np.random.randn(n_features, d_head) * sc
             for _ in range(num_heads)]
    W_Ks  = [np.random.randn(n_features, d_head) * sc
             for _ in range(num_heads)]
    W_Vs  = [np.random.randn(n_features, d_head) * sc
             for _ in range(num_heads)]

    # Output projection: (num_heads * d_head) → d_model
    W_O   = np.random.randn(num_heads * d_head, d_model) * sc

    # Final classification layer
    W_out = np.random.randn(d_model) * np.sqrt(2.0 / d_model)
    b_out = 0.0

    # Positional encoding
    PE = positional_encoding(seq_len, n_features)

    print(f"Training Multi-Head Transformer "
          f"({num_heads} heads, d_model={d_model})...")

    for epoch in range(epochs):
        correct = 0
        indices = np.random.permutation(
            len(train_data) - seq_len)[:800]

        for i in indices:
            # Get window and label
            window = train_data[i : i + seq_len]
            label  = 1 if (
                train_data[i + seq_len, close_idx]
                > train_data[i + seq_len - 1, close_idx]
            ) else 0

            # Forward pass
            x        = layer_norm(window + PE)
            mha_out  = multi_head_attention(
                x, W_Qs, W_Ks, W_Vs, W_O)
            pooled   = mha_out.mean(axis=0)  # (d_model,)
            pred     = sigmoid(float(pooled @ W_out) + b_out)

            # Track accuracy
            correct += int((pred > 0.5) == label)

            # Backward pass (gradient descent)
            error = pred - label
            grad  = error * pred * (1 - pred)

            # Update output layer
            W_out -= lr * grad * pooled
            b_out -= lr * grad

            # Update W_O (output projection)
            d_pooled = grad * W_out / len(mha_out)
            d_concat = np.outer(
                np.ones(len(mha_out)), d_pooled
            ) @ W_O.T
            W_O -= lr * np.outer(
                multi_head_attention(
                    x, W_Qs, W_Ks, W_Vs,
                    np.eye(num_heads * d_head)
                ).mean(axis=0),
                d_pooled
            )

        accuracy = correct / len(indices) * 100
        print(f"  Epoch {epoch+1}/{epochs} "
              f"| Accuracy: {accuracy:.1f}%")

    return W_Qs, W_Ks, W_Vs, W_O, W_out, b_out, PE


# ── Signal Generation ─────────────────────────────────────

def get_signal(window, W_Qs, W_Ks, W_Vs,
               W_O, W_out, b_out, PE):
    """
    Generate one signal value for a single window
    Returns float in [0,1]
    > 0.55 = Bullish
    < 0.45 = Bearish
    """
    x       = layer_norm(window + PE)
    mha_out = multi_head_attention(x, W_Qs, W_Ks, W_Vs, W_O)
    pooled  = mha_out.mean(axis=0)
    return sigmoid(float(pooled @ W_out) + b_out)


def signals_for_df(df_scaled, feature_cols,
                   W_Qs, W_Ks, W_Vs,
                   W_O, W_out, b_out, PE, seq_len):
    """Generate signals for entire dataframe"""
    data    = df_scaled[feature_cols].values
    signals = []

    for i in range(seq_len, len(data)):
        window = data[i - seq_len : i]
        s      = get_signal(
            window, W_Qs, W_Ks, W_Vs,
            W_O, W_out, b_out, PE
        )
        signals.append(s)

    pad     = [0.5] * seq_len
    return np.array((pad + signals)[:len(df_scaled)])


# ── Main Entry Point ──────────────────────────────────────

def generate_transformer_signals(train_df, test_df,
                                  train_scaled, test_scaled,
                                  feature_cols, seq_len=60,
                                  num_heads=4, d_model=32):
    """
    Main function — trains multi-head Transformer and
    returns train_df and test_df with signal column

    Upgrade from single-head (d_model=16, 1 head)
    to multi-head (d_model=32, 4 heads)
    """
    data       = train_scaled[feature_cols].values
    close_idx  = feature_cols.index('Close')
    n_features = len(feature_cols)

    # Train multi-head Transformer
    W_Qs, W_Ks, W_Vs, W_O, W_out, b_out, PE = train(
        data, close_idx, n_features,
        seq_len=seq_len,
        d_model=d_model,
        num_heads=num_heads
    )

    # Generate signals for train and test
    train_sig = signals_for_df(
        train_scaled, feature_cols,
        W_Qs, W_Ks, W_Vs,
        W_O, W_out, b_out, PE, seq_len
    )
    test_sig = signals_for_df(
        test_scaled, feature_cols,
        W_Qs, W_Ks, W_Vs,
        W_O, W_out, b_out, PE, seq_len
    )

    train_df = train_df.copy().reset_index(drop=True)
    test_df  = test_df.copy().reset_index(drop=True)

    train_df['Transformer_Signal'] = train_sig[:len(train_df)]
    test_df['Transformer_Signal']  = test_sig[:len(test_df)]

    # Print signal statistics
    bullish = sum(1 for s in test_sig if s > 0.55)
    bearish = sum(1 for s in test_sig if s < 0.45)
    neutral = len(test_sig) - bullish - bearish
    print(f"Signal Stats → Bullish: {bullish} "
          f"| Bearish: {bearish} "
          f"| Neutral: {neutral}")

    return train_df, test_df