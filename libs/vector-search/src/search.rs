use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct VectorSearch {
    embeddings: Vec<Vec<f32>>,
    texts: Vec<String>,
    metadata: Vec<JsValue>,
}

#[wasm_bindgen]
impl VectorSearch {
    #[wasm_bindgen(constructor)]
    pub fn new(
        embeddings: js_sys::Array,
        texts: Vec<String>,
        metadata: js_sys::Array,
    ) -> VectorSearch {
        // Convert js_sys::Array to Vec<Vec<f32>>
        let embeddings_vec: Vec<Vec<f32>> = (0..embeddings.length())
            .map(|i| {
                let arr = js_sys::Array::from(&embeddings.get(i));
                (0..arr.length())
                    .map(|j| arr.get(j).as_f64().unwrap_or(0.0) as f32)
                    .collect()
            })
            .collect();

        // Convert js_sys::Array to Vec<JsValue>
        let metadata_vec: Vec<JsValue> = (0..metadata.length())
            .map(|i| metadata.get(i))
            .collect();

        VectorSearch {
            embeddings: embeddings_vec,
            texts,
            metadata: metadata_vec,
        }
    }

    /// Calculate cosine similarity between two vectors
    fn cosine_similarity(a: &[f32], b: &[f32]) -> f32 {
        if a.len() != b.len() {
            return 0.0;
        }

        let dot_product: f32 = a.iter().zip(b.iter()).map(|(x, y)| x * y).sum();
        let norm_a: f32 = a.iter().map(|x| x * x).sum::<f32>().sqrt();
        let norm_b: f32 = b.iter().map(|x| x * x).sum::<f32>().sqrt();

        if norm_a == 0.0 || norm_b == 0.0 {
            return 0.0;
        }

        dot_product / (norm_a * norm_b)
    }

    /// Search for similar vectors using cosine similarity
    #[wasm_bindgen]
    pub fn search(&self, query_embedding: js_sys::Array, top_k: usize) -> JsValue {
        // Convert js_sys::Array to Vec<f32>
        let query_vec: Vec<f32> = (0..query_embedding.length())
            .map(|i| query_embedding.get(i).as_f64().unwrap_or(0.0) as f32)
            .collect();

        if self.embeddings.is_empty() || query_vec.is_empty() {
            return js_sys::Array::new().into();
        }

        let mut results: Vec<(usize, f32)> = self
            .embeddings
            .iter()
            .enumerate()
            .map(|(idx, embedding)| {
                let score = Self::cosine_similarity(&query_vec, embedding);
                (idx, score)
            })
            .collect();

        // Sort by score descending
        results.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap_or(std::cmp::Ordering::Equal));

        // Take top k results and convert to JsValue array
        let results_array = js_sys::Array::new();
        for (idx, score) in results.into_iter().take(top_k) {
            let result_obj = js_sys::Object::new();
            js_sys::Reflect::set(&result_obj, &"text".into(), &self.texts[idx].clone().into()).unwrap();
            js_sys::Reflect::set(&result_obj, &"score".into(), &JsValue::from_f64(score as f64)).unwrap();
            js_sys::Reflect::set(&result_obj, &"metadata".into(), &self.metadata[idx]).unwrap();
            results_array.push(&result_obj);
        }

        results_array.into()
    }
}

// SearchResult is now created directly as js_sys::Object in the search method
// No need for a struct since we're building JS objects directly

#[cfg(test)]
mod tests {
    use super::*;
    use wasm_bindgen_test::*;

    wasm_bindgen_test_configure!(run_in_browser);

    fn create_test_data() -> (Vec<Vec<f32>>, Vec<String>, Vec<JsValue>) {
        use serde_wasm_bindgen::to_value;
        let embeddings = vec![
            vec![1.0, 0.0, 0.0],
            vec![0.0, 1.0, 0.0],
            vec![0.0, 0.0, 1.0],
        ];
        let texts = vec![
            "First text".to_string(),
            "Second text".to_string(),
            "Third text".to_string(),
        ];
        let metadata = vec![
            to_value(&serde_json::json!({"id": 1})).unwrap(),
            to_value(&serde_json::json!({"id": 2})).unwrap(),
            to_value(&serde_json::json!({"id": 3})).unwrap(),
        ];
        (embeddings, texts, metadata)
    }

    #[wasm_bindgen_test]
    fn test_cosine_similarity_identical() {
        let a = vec![1.0, 0.0, 0.0];
        let b = vec![1.0, 0.0, 0.0];
        let similarity = VectorSearch::cosine_similarity(&a, &b);
        assert!((similarity - 1.0).abs() < 0.0001);
    }

    #[wasm_bindgen_test]
    fn test_cosine_similarity_orthogonal() {
        let a = vec![1.0, 0.0, 0.0];
        let b = vec![0.0, 1.0, 0.0];
        let similarity = VectorSearch::cosine_similarity(&a, &b);
        assert!((similarity - 0.0).abs() < 0.0001);
    }

    #[wasm_bindgen_test]
    fn test_search_top_k() {
        let (embeddings, texts, metadata) = create_test_data();
        
        // Convert to js_sys::Array for constructor
        let embeddings_arr = js_sys::Array::new();
        for emb in embeddings {
            let arr = js_sys::Array::new();
            for val in emb {
                arr.push(&JsValue::from_f64(val as f64));
            }
            embeddings_arr.push(&arr);
        }
        
        let metadata_arr = js_sys::Array::new();
        for m in metadata {
            metadata_arr.push(&m);
        }
        
        let search = VectorSearch::new(embeddings_arr, texts, metadata_arr);

        let query_arr = js_sys::Array::new();
        query_arr.push(&JsValue::from_f64(1.0));
        query_arr.push(&JsValue::from_f64(0.0));
        query_arr.push(&JsValue::from_f64(0.0));
        
        let results = search.search(query_arr, 2);
        let results_array = js_sys::Array::from(&results);

        assert_eq!(results_array.length(), 2);
        
        // Check first result
        let first_result = js_sys::Object::from(results_array.get(0));
        let first_text = js_sys::Reflect::get(&first_result, &"text".into()).unwrap().as_string().unwrap();
        assert_eq!(first_text, "First text");
    }

    #[wasm_bindgen_test]
    fn test_search_empty_query() {
        let (embeddings, texts, metadata) = create_test_data();
        
        let embeddings_arr = js_sys::Array::new();
        for emb in embeddings {
            let arr = js_sys::Array::new();
            for val in emb {
                arr.push(&JsValue::from_f64(val as f64));
            }
            embeddings_arr.push(&arr);
        }
        
        let metadata_arr = js_sys::Array::new();
        for m in metadata {
            metadata_arr.push(&m);
        }
        
        let search = VectorSearch::new(embeddings_arr, texts, metadata_arr);

        let query = js_sys::Array::new();
        let results = search.search(query, 2);
        let results_array = js_sys::Array::from(&results);

        assert_eq!(results_array.length(), 0);
    }

    #[wasm_bindgen_test]
    fn test_search_empty_embeddings() {
        let search = VectorSearch::new(
            js_sys::Array::new(),
            vec![],
            js_sys::Array::new()
        );
        let query_arr = js_sys::Array::new();
        query_arr.push(&JsValue::from_f64(1.0));
        query_arr.push(&JsValue::from_f64(0.0));
        query_arr.push(&JsValue::from_f64(0.0));
        
        let results = search.search(query_arr, 2);
        let results_array = js_sys::Array::from(&results);

        assert_eq!(results_array.length(), 0);
    }
}

